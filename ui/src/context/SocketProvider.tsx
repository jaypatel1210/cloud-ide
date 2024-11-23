import {
  createContext,
  FC,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketContext {
  socket: Socket;
}
interface Props {
  children: ReactNode;
  projectId: string;
  wsUrl: string;
  resourceId: string;
}

const SocketContext = createContext<SocketContext | null>(null);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

const SocketProvider: FC<Props> = ({
  children,
  projectId,
  wsUrl,
  resourceId,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io(wsUrl, {
      query: {
        resourceId,
        projectId: window.location.pathname.split('/')[2],
      },
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [projectId]);

  if (!socket) {
    return <p>Connecting...</p>;
  }

  return (
    <SocketContext.Provider value={{ socket: socket! }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
