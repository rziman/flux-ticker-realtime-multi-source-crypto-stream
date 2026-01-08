import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import type { MarketState } from '@shared/types';
interface LiveChartProps {
  data: MarketState[];
}
export function LiveChart({ data }: LiveChartProps) {
  // We calculate a domain that fits the data nicely
  const prices = data.flatMap(d => [d.binance, d.coinbase, d.chainlink]);
  const min = Math.min(...prices) * 0.9999;
  const max = Math.max(...prices) * 1.0001;
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorBinance" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#F97316" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#F97316" stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="colorCoinbase" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2}/>
            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
        <XAxis 
          dataKey="timestamp" 
          hide 
        />
        <YAxis 
          domain={[min, max]} 
          orientation="right"
          tick={{ fill: '#71717A', fontSize: 10, fontFamily: 'JetBrains Mono' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(val) => `$${val.toLocaleString()}`}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#18181B', 
            borderColor: 'rgba(255,255,255,0.1)',
            borderRadius: '12px',
            fontSize: '12px',
            fontFamily: 'JetBrains Mono'
          }}
          itemStyle={{ color: '#fff' }}
          labelStyle={{ display: 'none' }}
        />
        <Area 
          type="monotone" 
          dataKey="binance" 
          stroke="#F97316" 
          strokeWidth={2}
          fillOpacity={1} 
          fill="url(#colorBinance)" 
          isAnimationActive={false}
        />
        <Area 
          type="monotone" 
          dataKey="coinbase" 
          stroke="#3B82F6" 
          strokeWidth={2}
          fillOpacity={1} 
          fill="url(#colorCoinbase)" 
          isAnimationActive={false}
        />
        <Area 
          type="step" 
          dataKey="chainlink" 
          stroke="#6366F1" 
          strokeWidth={1.5}
          strokeDasharray="5 5"
          fill="transparent"
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}