import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type WhitelistApplication = {
  wallet:        string;
  x_link:        string;
  quote_link?:   string;
  comment_link?: string;
  tasks_done:    string[];
};

export type ApplicationStatus = 'pending' | 'approved' | 'rejected' | 'not_found';

/** Submit a new whitelist application */
export async function submitApplication(data: WhitelistApplication) {
  const { error } = await supabase
    .from('whitelist_applications')
    .insert([data]);
  if (error) throw error;
}

/** Check status by EVM wallet address */
export async function checkStatus(wallet: string): Promise<ApplicationStatus> {
  const { data, error } = await supabase
    .from('whitelist_applications')
    .select('status')
    .ilike('wallet', wallet.trim())
    .maybeSingle();

  if (error) throw error;
  if (!data) return 'not_found';
  return data.status as ApplicationStatus;
}
