import React from 'react';
import { Activity, Zap, ShieldCheck, Wifi, WifiOff } from 'lucide-react';
import { TickerCard } from '@/components/TickerCard';
import { LiveChart } from '@/components/LiveChart';
import { useFluxSocket } from '@/hooks/use-flux-socket';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Badge } from '@/components/ui/badge';
export function HomePage() {
  const { latest, history, status } = useFluxSocket();
  return (
    <div className="min-h-screen bg-[#09090B] text-foreground font-sans selection:bg-orange-500/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12 space-y-8">
          {/* Header */}
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-8">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center shadow-[0_0_15px_rgba(249,115,22,0.4)]">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-2xl font-bold tracking-tight">FLUX <span className="text-orange-500">TICKER</span></h1>
              </div>
              <p className="text-muted-foreground text-sm">Real-time Bitcoin Aggregate Feed</p>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle className="static" />
              <Badge variant="outline" className={`gap-1.5 px-3 py-1 border-white/10 bg-white/5 ${status === 'connected' ? 'text-green-400' : 'text-yellow-400'}`}>
                {status === 'connected' ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
                <span className="capitalize">{status}</span>
              </Badge>
              <Badge variant="outline" className="text-blue-400 border-white/10 bg-white/5">
                v1.0.4-live
              </Badge>
            </div>
          </header>
          {/* Ticker Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TickerCard 
              name="Binance" 
              price={latest?.binance} 
              color="orange" 
              logo="https://cryptologos.cc/logos/binance-coin-bnb-logo.png"
            />
            <TickerCard
              name="Coinbase"
              price={latest?.coinbase}
              color="blue"
              logo="https://cryptologos.cc/logos/coinbase-logo.png"
            />
            <TickerCard 
              name="Chainlink" 
              price={latest?.chainlink} 
              color="indigo" 
              logo="https://cryptologos.cc/logos/chainlink-link-logo.png"
              isOracle
            />
          </div>
          {/* Chart Section */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 space-y-6 overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-orange-500" />
                <h3 className="text-lg font-semibold text-white">Market Pulse</h3>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground">
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-orange-500" /> Binance</div>
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-500" /> Coinbase</div>
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-indigo-500" /> Oracle</div>
              </div>
            </div>
            <div className="h-[350px] w-full">
              <LiveChart data={history} />
            </div>
          </div>
          {/* Footer Metrics */}
          <footer className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/5">
             <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Network Latency</span>
                <span className="text-xs font-mono text-white/80">~42ms via Cloudflare Edge</span>
             </div>
             <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Durable Object Instance</span>
                <span className="text-xs font-mono text-white/80">Global Singleton #8f2a</span>
             </div>
             <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Oracle Verification</span>
                <span className="text-xs font-mono text-green-400 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Fully Synced
                </span>
             </div>
          </footer>
        </div>
      </div>
    </div>
  );
}