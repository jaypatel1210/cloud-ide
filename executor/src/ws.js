const { Server: SocketServer } = require('socket.io');
const chokidar = require('chokidar');

const { ALLOWED_ORIGINS, WORKSPACE_PATH, MAX_FILE_SIZE } = require('./config');
const { TerminalManager } = require('./terminal');
const { fetchFileContent, generateFileTree, saveFile } = require('./fs');
const { saveToFBS } = require('./firebase-storage');
const { withLogging } = require('./utils/socketLogger');

const terminalManager = new TerminalManager();

function initWS(httpServer) {
  const io = withLogging(
    new SocketServer(httpServer, {
      cors: {
        origin: ALLOWED_ORIGINS,
        methods: ['GET', 'POST'],
      },
    })
  );

  io.on('connection', async socket => {
    console.info('user connected', socket.id);

    const projectId = socket.handshake.query.projectId;

    if (!projectId) {
      socket.disconnect();
      terminalManager.clear(socket.id);
      console.error('No project ID provided');
      return;
    }

    initTerminal(socket, projectId);
    initFS(socket, projectId);

    socket.on('disconnect', () => {
      console.info('user disconnected', socket.id);
      terminalManager.clear(socket.id);
    });
  });
}

function initTerminal(socket, projectId) {
  socket.on('requestTerminal', () => {
    console.log('requestTerminal', socket.id, projectId);
    try {
      terminalManager.createPty(socket.id, projectId, (data, pid) => {
        socket.emit('terminalOutput', Buffer.from(data, 'utf-8'));
      });
    } catch (error) {
      console.error('Failed to create terminal');
      socket.emit('error', 'Failed to create terminal');
    }
  });

  socket.on('terminalInput', data => {
    try {
      terminalManager.write(socket.id, data);
    } catch (error) {
      console.error('Failed to write to terminal');
      socket.emit('error', 'Failed to write to terminal');
    }
  });
}

function initFS(socket, projectID) {
  socket.on('fetchFileTree', async callback => {
    try {
      const fileTree = await generateFileTree(WORKSPACE_PATH);
      callback(fileTree);
    } catch (error) {
      console.error('Failed to generate file tree');
      socket.emit('error', 'Failed to generate file tree');
    }
  });

  socket.on('fetchContent', async (filePath, callback) => {
    try {
      const fullPath = `${WORKSPACE_PATH}/${filePath}`;

      const data = await fetchFileContent(fullPath);

      callback(data);
    } catch (error) {
      console.error('Failed to fetch file content');
      socket.emit('error', 'Failed to fetch file content');
    }
  });

  // TODO: contents should be diff, not full file
  // Should be throttled before updating Firebase storage
  socket.on('updateContent', async (path, content) => {
    const fullPath = `${WORKSPACE_PATH}/${path}`;

    const byteSize = Buffer.byteLength(content, 'utf-8');
    if (byteSize > MAX_FILE_SIZE) {
      return socket.emit('error', `File size exceeds the limit of 10MB`);
    }

    try {
      await saveFile(fullPath, content);
      await saveToFBS(projectID, path, content);
    } catch (error) {
      console.error('Failed to save file');
      socket.emit('error', 'Failed to save file');
    }
  });

  // Watch the workspace directory for changes
  const watcher = chokidar.watch(WORKSPACE_PATH, {
    persistent: true,
    ignoreInitial: true, // Ignore the initial add events
  });

  watcher
    .on('add', watchFileTreeChanges)
    .on('unlink', watchFileTreeChanges)
    .on('addDir', watchFileTreeChanges)
    .on('unlinkDir', watchFileTreeChanges);

  async function watchFileTreeChanges() {
    try {
      const fileTree = await generateFileTree(WORKSPACE_PATH);
      socket.emit('fileTreeChange', fileTree);
    } catch (error) {
      console.error('Failed to generate file tree');
      socket.emit('error', 'Failed to generate file tree');
    }
  }
}

module.exports = { initWS };
