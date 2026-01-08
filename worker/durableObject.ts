import { DurableObject } from "cloudflare:workers";
import type { MarketState, WSMessage } from '@shared/types';
export class GlobalDurableObject extends DurableObject {
  private sessions = new Set<WebSocket>();
  private history: MarketState[] = [];
  private latestState: MarketState = {
    binance: 98000,
    coinbase: 98001,
    chainlink: 98000.5,
    timestamp: Date.now()
  };
  constructor(ctx: DurableObjectState, env: any) {
    super(ctx, env);
    // Initialize polling for Chainlink (simulated) and WS connections to Binance/Coinbase could be here
    // For this implementation, we simulate a ticker heartbeat to ensure stability in the DO environment
    this.startTicker();
  }
  async fetch(request: Request): Promise<Response> {
    const upgradeHeader = request.headers.get("Upgrade");
    console.log('DO fetch Upgrade header:', upgradeHeader);
    if (!upgradeHeader || upgradeHeader !== "websocket") {
      return new Response("Expected Upgrade: websocket", { status: 426 });
    }
    const pair = new WebSocketPair();
    const client = pair[0];
    const server = pair[1];
    await this.setupWebSocket(server);
    return new Response(null, { status: 101, webSocket: client });
  }
  private async setupWebSocket(ws: WebSocket) {
    ws.accept();
    this.sessions.add(ws);
    // Send initial snapshot
    const snapshot: WSMessage = {
      type: 'snapshot',
      data: this.history,
      latest: this.latestState
    };
    ws.send(JSON.stringify(snapshot));
    ws.addEventListener("close", () => {
      this.sessions.delete(ws);
    });
    ws.addEventListener("error", () => {
      this.sessions.delete(ws);
    });
  }
  private startTicker() {
    setInterval(() => {
      // Simulate price flux
      const drift = () => (Math.random() - 0.5) * 10;
      this.latestState = {
        binance: this.latestState.binance + drift(),
        coinbase: this.latestState.coinbase + drift(),
        chainlink: this.latestState.chainlink + (Math.random() - 0.5) * 2, // Oracle is more stable
        timestamp: Date.now()
      };
      this.history.push(this.latestState);
      if (this.history.length > 100) this.history.shift();
      this.broadcast({
        type: 'update',
        data: this.latestState
      });
    }, 1000);
  }
  private broadcast(message: WSMessage) {
    const payload = JSON.stringify(message);
    for (const ws of this.sessions) {
      try {
        ws.send(payload);
      } catch (e) {
        this.sessions.delete(ws);
      }
    }
  }
  // Preserve template methods for compatibility
  async getCounterValue(): Promise<number> {
    return (await this.ctx.storage.get("counter_value")) || 0;
  }
  async increment(amount = 1): Promise<number> {
    let v: number = (await this.ctx.storage.get("counter_value")) || 0;
    v += amount;
    await this.ctx.storage.put("counter_value", v);
    return v;
  }
  async getMarketData(): Promise<{latest: MarketState, history: MarketState[]}> { 
    return { latest: this.latestState, history: this.history.slice(-100) }; 
  }

  async getDemoItems(): Promise<any[]> { return []; }
}