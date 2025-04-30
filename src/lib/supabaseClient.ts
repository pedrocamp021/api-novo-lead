import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Lead = {
  id: string;
  nome: string;
  telefone: string;
  status: string;
  origem?: string;
  etapa_funil?: string;
  qualificacao?: string;
  notes?: string;
  entry_date: string;
  last_updated: string;
  is_new: boolean;
};