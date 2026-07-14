export interface HistoryItem {
  id: string;
  value: string;
  type: 'password' | 'hash' | 'encoded' | 'uuid';
  metadata: Record<string, unknown>;
  timestamp: number;
}

export interface ToolConfig {
  id: string;
  label: string;
  icon: React.ReactNode;
  component: React.FC<{ onGenerate: (item: HistoryItem) => void }>;
}

export interface PasswordOptions {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  digits: boolean;
  special: boolean;
  customCharset: string;
  batchSize: number;
}

export interface HashOptions {
  algorithm: 'bcrypt' | 'sha256' | 'argon2id';
  input: string;
  rounds?: number;
  memory?: number;
  iterations?: number;
}

export interface EncodeOptions {
  algorithm: 'base64' | 'hex' | 'url';
  direction: 'encode' | 'decode';
  input: string;
}
