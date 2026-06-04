import { useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

export function useReferral() {
  const { user } = useAuth();
  const processedRef = useRef(false);

  useEffect(() => {
    if (!user || processedRef.current) return;

    const params = new URLSearchParams(window.location.search);
    const refHandle = params.get('ref');
    if (!refHandle) return;

    // Prevent self-referral
    const cleanHandle = refHandle.replace('@', '');
    const userClean = user.twitter_handle.replace('@', '');
    if (cleanHandle === userClean) {
      window.history.replaceState({}, '', window.location.pathname);
      return;
    }

    const process = async () => {
      const { data, error } = await supabase.rpc('process_referral', {
        referrer_handle: refHandle,
      });

      if (error) {
        console.error('[Referral] RPC error:', error.message);
        return;
      }

      if (data?.success) {
        console.log('[Referral] Success! Awarded to', data.referrer);
        processedRef.current = true;
      }

      window.history.replaceState({}, '', window.location.pathname);
    };

    process();
  }, [user]);
}
