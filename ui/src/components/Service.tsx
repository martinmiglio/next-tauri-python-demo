'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import useService from '@/hooks/useService';
import { Message, MessageKind } from '@tauri-apps/plugin-websocket';
import { useEffect, useState } from 'react';

export default function Service() {
  const [message, setMessage] = useState<MessageKind<'Text', string> | null>(
    null
  );

  const { isAlive, send, addListener } = useService();

  const [text, setText] = useState<string>('');

  useEffect(() => {
    addListener((msg: Message) => {
      console.log('Received message:', msg);
      if (msg.type !== 'Text') return;
      setMessage(msg);
    });
  }, [addListener]);

  return (
    <div>
      <p>
        Service is{' '}
        <span className={isAlive ? 'text-green-500' : 'text-red-500'}>
          {isAlive ? 'alive' : 'dead'}
        </span>
      </p>
      <div className="flex">
        <Input
          type="text"
          onChange={(e) => setText(e.target.value)}
          disabled={!isAlive}
          className="rounded-r-none"
          placeholder="Type a message..."
        />
        <Button
          onClick={() => {
            if (!send) return;
            send({ type: 'Text', data: text });
          }}
          disabled={!isAlive}
          className="rounded-l-none"
        >
          Send
        </Button>
      </div>
      <pre className="font-mono">{message?.data ?? 'Nothing yet...'}</pre>
    </div>
  );
}
