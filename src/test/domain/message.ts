
export interface Message {
  source: string;
  ip: string;
  port: number;
  rootPath: string;
  ssl: boolean;
  timeout: number;
  endpoint: string;
}
    