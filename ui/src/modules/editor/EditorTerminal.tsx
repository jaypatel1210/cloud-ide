import { useEffect, useRef } from 'react';
import { Terminal as XTerminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';

import decodeBuffer from '../../utils/decodeBuffer';
import { useSocket } from '../../context/SocketProvider';

const fitAddon = new FitAddon();

const TERMINAL_OPTIONS = {
  cursorBlink: true,
  cols: 200,
  theme: {
    background: 'black',
  },
};

const EditorTerminal = () => {
  const { socket } = useSocket();
  const terminalRef = useRef(null);
  const isRendered = useRef(false);

  useEffect(() => {
    if (!terminalRef.current || isRendered.current) {
      return;
    }

    isRendered.current = true;
    socket.emit('requestTerminal');
    socket.on('terminalOutput', terminalOutputHandler);

    const terminal = new XTerminal(TERMINAL_OPTIONS);

    terminal.loadAddon(fitAddon);
    terminal.open(terminalRef.current);
    fitAddon.fit();

    function terminalOutputHandler(data: ArrayBuffer | string) {
      if (data instanceof ArrayBuffer) {
        terminal.write(decodeBuffer(data));
      }
    }

    terminal.onData(data => {
      socket.emit('terminalInput', data);
    });

    return () => {
      terminal.dispose();
    };
  }, [terminalRef.current]);

  return (
    <div ref={terminalRef} style={{ width: '100%', height: '100%' }}></div>
  );
};

export default EditorTerminal;
