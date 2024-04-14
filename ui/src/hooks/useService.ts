import WebSocket, { Message } from '@tauri-apps/plugin-websocket';
import { useState, useEffect, useCallback, useRef } from 'react';

const service_address = 'localhost:8040';

const ws_url = new URL(`ws://${service_address}/ws`);

export default function useService() {
  const socketRef = useRef<WebSocket | null>(null);
  const [isAlive, setIsAlive] = useState(false);

  const start = useCallback(async () => {
    // connect to the WebSocket server
    const ws = await WebSocket.connect(ws_url.toString());
    socketRef.current = ws;

    // Add listeners for ws status
    ws.addListener((msg) => {
      if (msg.type !== 'Pong') return;
      console.log('WS Pong received, connection is alive');
      setIsAlive(true);
    });
    ws.addListener((msg) => {
      if (msg.type !== 'Close') return;
      console.error('WS connection closed');
      setIsAlive(false);
    });
    ws.send({ type: 'Ping', data: [0] });
    console.info('Connected to WS');
  }, []);

  const stop = useCallback(async () => {
    if (!socketRef.current) return;
    await socketRef.current.disconnect();
    socketRef.current = null;
    setIsAlive(false);
    console.info('Disconnected from WS');
  }, []);

  useEffect(() => {
    console.log('ON MOUNT');
    start();
    return () => {
      stop();
    };
  }, [start, stop]);

  const send = useCallback(
    (msg: Message) => {
      if (!socketRef.current || !isAlive) return;
      console.log(typeof msg, msg);
      socketRef.current.send(msg);
    },
    [isAlive]
  );

  const addListener = useCallback(
    (listener: (msg: Message) => void) => {
      if (!socketRef.current || !isAlive) return;
      socketRef.current.addListener(listener);
    },
    [isAlive]
  );

  return { send, addListener, isAlive };
}
