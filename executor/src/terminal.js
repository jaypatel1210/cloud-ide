const nodePty = require('node-pty');

const { WORKSPACE_PATH } = require('./config');

const SHELL = 'bash';

class TerminalManager {
  #sessions = {};

  createPty(id, projectId, onTerminalOutput) {
    console.log('Creating terminal:', id);
    const ptyTerminal = nodePty.spawn(SHELL, [], {
      cols: 100,
      name: 'xterm',
      cwd: WORKSPACE_PATH,
    });

    console.log('Created terminal:', ptyTerminal.pid);
    ptyTerminal.onData(data => {
      onTerminalOutput(data, ptyTerminal.pid);
    });

    this.#sessions[id] = {
      projectId,
      terminal: ptyTerminal,
    };

    ptyTerminal.onExit(() => {
      delete this.#sessions[ptyTerminal.pid];
    });

    return ptyTerminal;
  }

  write(terminalId, data) {
    this.#sessions[terminalId]?.terminal.write(data);
  }

  clear(terminalId) {
    this.#sessions[terminalId]?.terminal.kill();
    delete this.#sessions[terminalId];
  }
}

module.exports = { TerminalManager };
