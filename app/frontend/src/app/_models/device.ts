export interface Device {
  id: number;
  description: string;
  status: number;
  connected: boolean;
  temp: number;
  targetTemp?: number;
  timestamp?: number;
  time?: number;
}
