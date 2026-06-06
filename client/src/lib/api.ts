import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
);

export type ApplicationStatus = 'approved' | 'pending' | 'rejected' | 'not_found';

export async function submitApplication(data: {
  evmAddress: string;
  xUsername: string;
  quoteTweet: string;
  referredBy?: string; // UUID of the referrer's row
}): Promise<{ id: string }> {
  const { data: row, error } = await supabase
    .from('minizen')
    .insert({
      evm_address: data.evmAddress,
      x_username: data.xUsername,
      quote_tweet: data.quoteTweet,
      ...(data.referredBy ? { referred_by: data.referredBy } : {}),
    })
    .select('id')
    .single();

  if (error) throw new Error(error.message);
  return { id: row.id };
}

export async function checkStatus(address: string): Promise<ApplicationStatus> {
  const { data, error } = await supabase
    .from('minizen')
    .select('status')
    .eq('evm_address', address.toLowerCase())
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) return 'not_found';

  return (data.status as ApplicationStatus) ?? 'not_found';
}
