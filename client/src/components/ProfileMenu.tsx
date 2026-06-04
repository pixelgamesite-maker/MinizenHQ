import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { ShellIcon } from './ShellIcon';
import { ASSETS } from '../lib/assets';

export default function ProfileMenu() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  if (!user) return null;

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-2xl"
        style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,107,53,0.15)' }}
      >
        <img
          src={user.twitter_avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.twitter_handle}`}
          alt={user.twitter_handle}
          className="w-8 h-8 rounded-full border-2 border-[#FF6B35]/40"
        />
        <span className="text-sm font-black text-[#1a1a2e] hidden sm:inline">@{user.twitter_handle}</span>
        <span className="text-xs text-[#FF6B35]">▾</span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-full mt-2 w-72 rounded-2xl z-50 overflow-hidden"
              style={{ background: 'rgba(255,251,242,0.95)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,107,53,0.12)', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}
            >
              <div className="p-4 flex items-center gap-3" style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                <img
                  src={user.twitter_avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.twitter_handle}`}
                  alt={user.twitter_handle}
                  className="w-12 h-12 rounded-full border-2 border-[#FF6B35]/30"
                />
                <div>
                  <div className="text-sm font-black text-[#1a1a2e]">@{user.twitter_handle}</div>
                  <div className="text-[10px] font-bold text-[#FF6B35] uppercase tracking-wider">Season 1</div>
                </div>
              </div>

              <div className="p-3 space-y-2">
                <div className="flex items-center justify-between p-2.5 rounded-xl" style={{ background: 'rgba(255,107,53,0.06)' }}>
                  <div className="flex items-center gap-2">
                    <ShellIcon size={14} />
                    <span className="text-xs font-bold text-[#1a1a2e]">Shells</span>
                  </div>
                  <span className="text-sm font-black text-[#FF6B35]">{user.shells_balance.toLocaleString()}</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl" style={{ background: 'rgba(6,214,160,0.06)' }}>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">📦</span>
                    <span className="text-xs font-bold text-[#1a1a2e]">Items</span>
                  </div>
                  <span className="text-sm font-black text-[#06D6A0]">{user.items}/{3}</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl" style={{ background: 'rgba(245,158,11,0.06)' }}>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">✦</span>
                    <span className="text-xs font-bold text-[#1a1a2e]">Golden Shell</span>
                  </div>
                  <span className="text-sm font-black text-[#f59e0b]">{user.items === 3 ? 'Mint Ready' : 'Crafting'}</span>
                </div>
              </div>

              <div className="p-3 pt-0">
                <button
                  onClick={() => { logout(); setOpen(false); }}
                  className="w-full py-2.5 rounded-xl text-xs font-black uppercase tracking-widest text-white"
                  style={{ background: '#1a1a2e', boxShadow: '0 3px 0 #0a0a1a' }}
                >
                  Sign Out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
