import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
interface TickerCardProps {
  name: string;
  price?: number;
  color: 'orange' | 'blue' | 'indigo';
  logo: string;
  isOracle?: boolean;
}
export function TickerCard({ name, price, color, logo, isOracle }: TickerCardProps) {
  const [prevPrice, setPrevPrice] = useState<number | undefined>(price);
  const [trend, setTrend] = useState<'up' | 'down' | 'neutral'>('neutral');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (price && prevPrice) {
      if (price > prevPrice) setTrend('up');
      else if (price < prevPrice) setTrend('down');
      setPrevPrice(price);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setTrend('neutral'), 800);
    }
  }, [price]);
  const colorMap = {
    orange: 'from-orange-500/10 to-transparent border-orange-500/20 text-orange-500 shadow-orange-500/5',
    blue: 'from-blue-500/10 to-transparent border-blue-500/20 text-blue-400 shadow-blue-500/5',
    indigo: 'from-indigo-500/10 to-transparent border-indigo-500/20 text-indigo-400 shadow-indigo-500/5',
  };
  const glowColor = trend === 'up' ? 'rgba(34, 197, 94, 0.2)' : trend === 'down' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(0,0,0,0)';
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        boxShadow: `0 0 40px ${glowColor}`,
        borderColor: trend === 'up' ? 'rgba(34, 197, 94, 0.4)' : trend === 'down' ? 'rgba(239, 68, 68, 0.4)' : 'rgba(255, 255, 255, 0.1)'
      }}
      className={cn(
        "relative group overflow-hidden rounded-3xl border p-6 transition-colors duration-500 bg-gradient-to-br",
        colorMap[color]
      )}
    >
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 p-2 flex items-center justify-center">
            <img src={logo} alt={name} className="w-full h-full object-contain filter grayscale brightness-200 group-hover:grayscale-0 transition-all duration-300" />
          </div>
          <div>
            <h4 className="font-semibold text-white group-hover:text-orange-400 transition-colors">{name}</h4>
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest">{isOracle ? 'Oracle Feed' : 'Exchange Stream'}</span>
          </div>
        </div>
        {isOracle && (
          <Globe className="w-4 h-4 text-indigo-400 animate-pulse" />
        )}
      </div>
      <div className="space-y-1">
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-mono text-muted-foreground">$</span>
          <AnimatePresence mode="wait">
            <motion.div
              key={price}
              initial={{ y: trend === 'up' ? 10 : -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: trend === 'up' ? -10 : 10, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="text-4xl md:text-5xl font-mono font-bold tracking-tighter text-white"
            >
              {price?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) ?? '---.--'}
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="flex items-center gap-2">
          {trend !== 'neutral' ? (
            <motion.div 
              initial={{ scale: 0 }} 
              animate={{ scale: 1 }} 
              className={cn("flex items-center text-xs font-mono", trend === 'up' ? "text-green-400" : "text-red-400")}
            >
              {trend === 'up' ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
              {trend === 'up' ? '+0.01%' : '-0.01%'}
            </motion.div>
          ) : (
            <div className="text-xs font-mono text-muted-foreground">NO SPREAD</div>
          )}
        </div>
      </div>
      {/* Background Glow */}
      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-current opacity-5 blur-[80px] group-hover:opacity-10 transition-opacity" />
    </motion.div>
  );
}