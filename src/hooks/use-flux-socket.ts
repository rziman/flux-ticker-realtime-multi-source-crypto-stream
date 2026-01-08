import { useState, useEffect } from 'react';
import type { MarketState } from '@shared/types';
export function useFluxSocket() {
  const [latest, setLatest] = useState<MarketState | null>(null);
  const [history, setHistory] = useState<MarketState[]>([]);
  const [status, setStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  
  useEffect(() => {
    console.log('Starting Flux Ticker polling...');
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/market');
        if (res.ok) {
          const data = await res.json();
          setLatest(data.latest);
          setHistory(data.history);
          setStatus('connected');
          console.log('Flux Ticker poll success');
        } else {
          console.error('Poll failed');
          setStatus('disconnected');
        }
      } catch (e) {
        console.error('Poll failed', e);
        setStatus('disconnected');
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return { latest, history, status };
}