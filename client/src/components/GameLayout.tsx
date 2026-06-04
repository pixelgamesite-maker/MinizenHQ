import React from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';
import { useAuth } from '../hooks/useAuth';
import ProfileMenu from './ProfileMenu';
import { ShellIcon } from './ShellIcon';
import { ASSETS } from '../lib/assets';

export default function GameLayout({ children, pageId, label, color = '#FF6B35' }: { 
  children: React.ReactNode; 
  pageId: string;
  label: string;
  color?: string;
}) {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#FFFBF2' }}>
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}>
          <ShellIcon size={34} />
        </motion.div>
      </div>
    );
  }

  if (!user) {
    setLocation('/');
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col relative" style={{ background: 'linear-gradient(170deg, #FFFBF2 0%, #FFF3DC 60%, #FFFAF0 100%)' }}>
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full"
          style={{ background: color, opacity: 0.05 }}
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </div>

      <div className="sticky top-0 z-20 flex items-center justify-between px-4 py-3 border-b border-black/5" style={{ background: 'rgba(255,251,242,0.9)', backdropFilter: 'blur(14px)' }}>
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.1, x: -2 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setLocation('/game')}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-white border border-black/5 shadow-sm"
          >
            <span className="text-xl font-black text-[#1a1a2e]">←</span>
          </motion.button>
          <div>
            <span className="font-black text-sm text-[#1a1a2e]" style={{ fontFamily: 'Georgia, serif' }}>{label}</span>
            {pageId === 'shell-blitz' && (
              <span className="ml-2 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-[#FF6B35]/10 text-[#FF6B35]">Live</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <motion.div
            key={user.shells_balance}
            animate={{ scale: [1, 1.12, 1] }}
            transition={{ duration: 0.28 }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#06D6A0]/10 border border-[#06D6A0]/25"
          >
            <ShellIcon size={15} />
            <span className="text-sm font-black tabular-nums text-[#048a67]" style={{ fontFamily: 'monospace' }}>
              {user.shells_balance.toLocaleString()}
            </span>
          </motion.div>
          <ProfileMenu />
        </div>
      </div>

      <div className="flex-1 relative z-10">
        {children}
      </div>
    </div>
  );
}

