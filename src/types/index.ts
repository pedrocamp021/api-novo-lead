export interface User {
  id: string;
  email: string;
  password: string; // In a real app, never store plain text passwords
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  status: string;
  source?: string;
  funnelStage?: string;
  entryDate: string;
  lastUpdated: string;
  notes?: string;
  isNew: boolean;
  archived: boolean;
}

export interface StatusConfig {
  id: string;
  name: string;
  color: string;
  order: number;
}