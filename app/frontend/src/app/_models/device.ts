export interface Device {
  id: number;
  description: string;
  status: string;
  connected: boolean;
  temp: number;
  targetTemp?: number;
  timestamp?: number;
  time?: number;
}
