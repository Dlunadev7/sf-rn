import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io('https://sofocon.api.novexisconsulting.xyz');

    newSocket.on('connect', () => {
      console.log('Conectado al servidor de Socket.IO');
    });

    newSocket.on('connect_error', (err) => {
      console.error('Error de conexión:', err.message);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return socket;
};
