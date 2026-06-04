import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LOGO_URL } from '../lib/assets';

const c = {
  bg: '#f5f2ee', ink: '#111111', inkLight: '#444', inkFaint: '#999',
  inkHair: '#ccc', white: '#ffffff', paper: '#ede9e3',
};

const NAV_LINKS = [
  { label: 'Home',  href: '/' },
  { label: 'About', href: '/about' },
  { label: 'FAQ',   href: '/faq' },
];

interface LayoutProps {
  children: React.ReactNode;
  currentPath?: string;
}

export default function Layout({ children, currentPath = '/' }: LayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div style={{ minHeight: '100vh', background: c.bg }}>
      {/* Nav */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 40, background: c.bg, borderBottom: `2px solid ${c.ink}` }}>
        <div style={{ maxWidth: 680, margin: '0 auto', padding: '0 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56 }}>
          {/* Logo only */}
          <a href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <img src={LOGO_URL} alt="Minizen" style={{ height: 36, objectFit: 'contain' }}
              onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          </a>

          {/* Hamburger button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', display: 'flex', flexDirection: 'column', gap: 5 }}
            aria-label="Toggle menu"
          >
            <motion.span
              animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 7 : 0 }}
              style={{ display: 'block', width: 22, height: 2, background: c.ink, transformOrigin: 'center', transition: 'background 0.2s' }} />
            <motion.span
              animate={{ opacity: menuOpen ? 0 : 1, scaleX: menuOpen ? 0 : 1 }}
              style={{ display: 'block', width: 22, height: 2, background: c.ink }} />
            <motion.span
              animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -7 : 0 }}
              style={{ display: 'block', width: 22, height: 2, background: c.ink, transformOrigin: 'center' }} />
          </button>
        </div>
      </nav>

      {/* Mobile slide-out menu */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(17,17,17,0.35)', zIndex: 45 }} />

            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 30 }}
              style={{
                position: 'fixed', top: 0, right: 0, bottom: 0, width: 'min(320px, 85vw)',
                background: c.bg, borderLeft: `3px solid ${c.ink}`,
                boxShadow: `-6px 0 0 ${c.ink}`, zIndex: 50,
                display: 'flex', flexDirection: 'column', padding: '0',
              }}>
              {/* Drawer header */}
              <div style={{ height: 56, borderBottom: `2px solid ${c.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 1.25rem' }}>
                <span style={{ fontFamily: "'Permanent Marker', cursive", fontSize: '1rem', color: c.ink }}>MINIZEN HQ</span>
                <button onClick={() => setMenuOpen(false)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'monospace', fontSize: '1.1rem', color: c.inkLight }}>✕</button>
              </div>

              {/* Links */}
              <div style={{ flex: 1, padding: '2rem 1.25rem', display: 'flex', flexDirection: 'column', gap: 0 }}>
                {NAV_LINKS.map((link, i) => {
                  const active = currentPath === link.href;
                  return (
                    <motion.a key={link.href} href={link.href}
                      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 + i * 0.06 }}
                      onClick={() => setMenuOpen(false)}
                      style={{
                        display: 'block', fontFamily: "'Permanent Marker', cursive",
                        fontSize: '2rem', color: active ? c.ink : c.inkFaint,
                        textDecoration: 'none', padding: '0.75rem 0',
                        borderBottom: `1px solid ${c.inkHair}`,
                        letterSpacing: '0.02em',
                      }}>
                      {link.label}
                      {active && <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', color: c.inkFaint, marginLeft: 12, verticalAlign: 'middle', letterSpacing: '0.1em' }}>← here</span>}
                    </motion.a>
                  );
                })}
              </div>

              {/* Drawer footer */}
              <div style={{ padding: '1.5rem 1.25rem', borderTop: `2px solid ${c.inkHair}` }}>
                <a href="https://x.com/minizenhq?s=21" target="_blank" rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: c.inkLight, fontFamily: "'Space Mono', monospace", fontSize: '0.7rem', fontWeight: 700, textDecoration: 'none', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  @minizenhq
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Footer */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:wght@400;700&family=Permanent+Marker&family=Caveat:wght@400;700&display=swap');
      `}</style>

      {children}

      <footer style={{ borderTop: `2px solid ${c.ink}`, marginTop: '2rem' }}>
        <div style={{ maxWidth: 680, margin: '0 auto', padding: '2rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <span style={{ fontFamily: "'Permanent Marker', cursive", fontSize: '1rem', color: c.inkLight }}>
            MINIZEN HQ
          </span>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', color: c.inkFaint, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            © 2025 · Draw your own path.
          </span>
          <a href="https://x.com/minizenhq?s=21" target="_blank" rel="noopener noreferrer"
            style={{ display: 'flex', alignItems: 'center', gap: 5, color: c.inkFaint, fontSize: '0.65rem', fontWeight: 700, textDecoration: 'none', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: "'Space Mono', monospace" }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            @minizenhq
          </a>
        </div>
      </footer>
    </div>
  );
}
