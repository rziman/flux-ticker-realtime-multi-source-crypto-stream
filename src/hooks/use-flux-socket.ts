import { useState, useEffect, useRef } from 'react';
import type { MarketState, WSMessage } from '@shared/types';
export function useFluxSocket() {
  const [latest, setLatest] = useState<MarketState | null>(null);
  const [history, setHistory] = useState<MarketState[]>([]);
  const [status, setStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  const wsRef = useRef<WebSocket | null>(null);
  useEffect(() => {
    let reconnectTimeout: NodeJS.Timeout;
    const connect = () => {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const host = window.location.host;
      const wsUrl = `${protocol}//${host}/api/ws`;
      console.log('Connecting to Flux Ticker...', wsUrl);
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;
      ws.onopen = () => {
        setStatus('connected');
        console.log('Flux Ticker connected');
      };
      ws.onmessage = (event) => {
        try {
          const msg: WSMessage = JSON.parse(event.data);
          if (msg.type === 'snapshot') {
            setLatest(msg.latest);
            setHistory(msg.data);
          } else if (msg.type === 'update') {
            setLatest(msg.data);
            setHistory(prev => {
              const next = [...prev, msg.data];
              return next.length > 100 ? next.slice(-100) : next;
            });
          }
        } catch (e) {
          console.error('Failed to parse WS message', e);
        }
      };
      ws.onclose = () => {
        setStatus('disconnected');
        console.log('Flux Ticker disconnected, retrying...');
        reconnectTimeout = setTimeout(connect, 3000);
      };
      ws.onerror = (err) => {
        console.error('WS Error:', err);
        ws.close();
      };
    };
    connect();
    return () => {
      if (wsRef.current) wsRef.current.close();
      clearTimeout(reconnectTimeout);
    };
  }, []);
  return { latest, history, status };
}