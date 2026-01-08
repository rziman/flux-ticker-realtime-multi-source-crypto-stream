export interface DemoItem {
  id: string;
  name: string;
  value: number;
}
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
export interface MarketState {
  binance: number;
  coinbase: number;
  chainlink: number;
  timestamp: number;
}
export type WSMessage = 
  | { type: 'snapshot'; data: MarketState[]; latest: MarketState }
  | { type: 'update'; data: MarketState }
  | { type: 'error'; message: string };