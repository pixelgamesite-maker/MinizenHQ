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
  referredBySlug?: string; // short slug from ?ref= param
}): Promise<{ refSlug: string }> {
  // Resolve the referrer's UUID from their slug if present
  let referredById: string | null = null;
  if (data.referredBySlug) {
    const { data: referrer } = await supabase
      .from('minizen')
      .select('id')
      .eq('ref_slug', data.referredBySlug)
      .maybeSingle();
    if (referrer) referredById = referrer.id;
  }

  const { data: row, error } = await supabase
    .from('minizen')
    .insert({
      evm_address: data.evmAddress,
      x_username: data.xUsername,
      quote_tweet: data.quoteTweet,
      ...(referredById ? { referred_by: referredById } : {}),
    })
    .select('ref_slug')
    .single();

  if (error) throw new Error(error.message);
  return { refSlug: row.ref_slug };
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
