
export interface APIKey {
  id: string;
  name: string;
  key: string;
  provider: string;
  createdAt: number;
  lastUsed?: number;
  tags: string[];
}

export type VaultStatus = 'locked' | 'unlocked' | 'error';
