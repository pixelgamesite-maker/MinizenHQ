import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export function useAuth() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;
    
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.user.id)
      .single();
      
    if (data) setProfile(data);
  }, []);

  useEffect(() => {
    const ensureProfile = async (authUser: any) => {
      const meta = authUser.user_metadata;
      const handle = meta.user_name || meta.preferred_username || 'you';
      const avatar = meta.avatar_url || '';
      const providerId = meta.provider_id || authUser.id;

      const { data, error } = await supabase
        .from('users')
        .upsert({
          id: authUser.id,
          twitter_id: providerId,
          twitter_handle: handle,
          twitter_avatar: avatar,
        }, { onConflict: 'id' })
        .select()
        .single();

      if (error) console.error('UPSERT ERROR:', error.message);
      if (data) setProfile(data);
      setLoading(false);
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) ensureProfile(session.user);
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) ensureProfile(session.user);
      else { setProfile(null); setLoading(false); }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'x',
      options: { redirectTo: 'https://planetslog.xyz/' },
    });
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setProfile(null);
  };

  return { user: profile, loading, login, logout, refreshProfile };
}
