import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { submitApplication, checkStatus, type ApplicationStatus } from '../lib/api';

type Step = 'idle' | 'confirm' | 'form' | 'success';
type TaskKey = 'follow' | 'retweet' | 'quote';

const MAIN_TWEET_URL = 'https://x.com/minizenhq/status/PLACEHOLDER';

const TASKS = [
  { key: 'follow' as TaskKey, label: 'Follow @minizenhq', url: 'https://x.com/minizenhq?s=21' },
  { key: 'retweet' as TaskKey, label: 'Retweet the post', url: MAIN_TWEET_URL },
  {
    key: 'quote' as TaskKey, label: 'Quote tweet the post', url: MAIN_TWEET_URL,
    needsInput: true, placeholder: 'Paste your quote tweet link',
  },
];

const HONORARIES = [
  { name: 'TMA',     handle: '@tma_420',       file: 'TMA.JPG' },
  { name: 'Brated',  handle: '@br4ted',        file: 'Brated.JPG' },
  { name: 'SafZ',    handle: '@crypsaf',       file: 'SafZ.JPG' },
  { name: 'Jasich',  handle: '@thejasich',     file: 'Jasich.JPG' },
  { name: 'Kelvin',  handle: '@kelvinoyibo2',  file: 'H0ld .JPG' },
  { name: 'Tess',    handle: '@tessonchain',   file: 'Tess.JPG' },
  { name: 'Smart',   handle: '@xmartsol',      file: 'Smart.JPG' },
  { name: 'Gorilla', handle: '@cryptogorilla', file: 'Gorilla.JPG' },
  { name: 'JBond',   handle: '@jbondwagon',    file: 'JBond.JPG' },
];

const COLLECTION_PREVIEW = ['515.JPG','516.JPG','517.JPG','518.JPG','519.JPG','520.JPG','521.JPG'];

const DURATION = 72 * 60 * 60;
function getEnd() {
  const s = sessionStorage.getItem('mz_end');
  if (s) return parseInt(s);
  const e = Date.now() + DURATION * 1000;
  sessionStorage.setItem('mz_end', String(e));
  return e;
}
function useCountdown() {
  const [secs, setSecs] = useState(0);
  useState(() => {
    const tick = () => setSecs(Math.max(0, Math.floor((getEnd() - Date.now()) / 1000)));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  });
  return { h: Math.floor(secs / 3600), m: Math.floor((secs % 3600) / 60), s: secs % 60 };
}
const pad = (n: number) => String(n).padStart(2, '0');

const STATUS_MAP: Record<ApplicationStatus, { label: string; color: string }> = {
  approved:  { label: '✓ Whitelisted',  color: '#111' },
  pending:   { label: '◌ Under Review', color: '#555' },
  rejected:  { label: '✕ Not Selected', color: '#888' },
  not_found: { label: '— Not Found',    color: '#aaa' },
};

const c = {
  bg: '#f5f2ee', ink: '#111111', inkLight: '#444', inkFaint: '#999',
  inkHair: '#ccc', white: '#ffffff', paper: '#ede9e3', paperDark: '#ddd8d0',
};

const fieldInput: React.CSSProperties = {
  width: '100%', background: c.white, border: `2px solid ${c.ink}`,
  borderRadius: 0, color: c.ink, fontFamily: "'Space Mono', monospace",
  fontSize: '0.82rem', padding: '0.7rem 0.9rem', outline: 'none', boxSizing: 'border-box',
};
const inkBtn: React.CSSProperties = {
  background: c.ink, color: c.white, border: `2px solid ${c.ink}`, borderRadius: 0,
  fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: '0.78rem',
  letterSpacing: '0.1em', textTransform: 'uppercase' as const,
  padding: '0.85rem 2rem', cursor: 'pointer', display: 'inline-block',
};
const ghostBtn: React.CSSProperties = {
  background: 'transparent', color: c.ink, border: `2px solid ${c.ink}`, borderRadius: 0,
  fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: '0.78rem',
  letterSpacing: '0.08em', textTransform: 'uppercase' as const,
  padding: '0.75rem 1.25rem', cursor: 'pointer',
};

export const NoiseOverlay = () => (
  <div style={{
    position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 999,
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
    opacity: 0.35,
  }} />
);

export const HatchDivider = () => (
  <div style={{ width: '100%', maxWidth: 680, margin: '0 auto' }}>
    <svg width="100%" height="12" viewBox="0 0 680 12" preserveAspectRatio="none">
      <pattern id="hatch" width="10" height="12" patternUnits="userSpaceOnUse">
        <line x1="0" y1="12" x2="10" y2="0" stroke={c.inkHair} strokeWidth="1"/>
      </pattern>
      <rect width="100%" height="12" fill="url(#hatch)" />
    </svg>
  </div>
);

export const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '2rem' }}>
    <div style={{ width: 28, height: 2, background: c.ink }} />
    <span style={{
      fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', fontWeight: 700,
      letterSpacing: '0.25em', textTransform: 'uppercase', color: c.inkLight,
    }}>{children}</span>
  </div>
);

function StatusChecker() {
  const [wallet, setWallet] = useState('');
  const [status, setStatus] = useState<ApplicationStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const check = async () => {
    if (!wallet.trim()) return;
    setLoading(true); setErr(''); setStatus(null);
    try { setStatus(await checkStatus(wallet.trim())); }
    catch { setErr('Connection error. Try again.'); }
    finally { setLoading(false); }
  };

  return (
    <section style={{ width: '100%', maxWidth: 640, padding: '4rem 0' }}>
      <SectionLabel>Check Status</SectionLabel>
      <div style={{ display: 'flex', gap: 0 }}>
        <input
          style={{ ...fieldInput, flex: 1, borderRight: 'none' }}
          value={wallet} onChange={e => setWallet(e.target.value)}
          placeholder="0x… wallet address" onKeyDown={e => e.key === 'Enter' && check()}
        />
        <button onClick={check} disabled={loading || !wallet.trim()} style={{ ...ghostBtn, borderRadius: 0, whiteSpace: 'nowrap' }}>
          {loading ? '···' : 'Check →'}
        </button>
      </div>
      <AnimatePresence>
        {status && (
          <motion.p initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
            style={{ marginTop: 10, fontFamily: "'Space Mono', monospace", fontSize: '0.78rem', fontWeight: 700, color: STATUS_MAP[status].color, letterSpacing: '0.06em' }}>
            {STATUS_MAP[status].label}
          </motion.p>
        )}
        {err && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ marginTop: 8, fontFamily: "'Space Mono', monospace", fontSize: '0.72rem', color: '#c00' }}>
            {err}
          </motion.p>
        )}
      </AnimatePresence>
    </section>
  );
}

function CountdownSection() {
  const { h, m, s } = useCountdown();
  const units = [{ val: pad(h), label: 'HRS' }, { val: pad(m), label: 'MIN' }, { val: pad(s), label: 'SEC' }];
  return (
    <section style={{ width: '100%', maxWidth: 640, padding: '4rem 0' }}>
      <SectionLabel>Allowlist Closes In</SectionLabel>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem' }}>
        {units.map(({ val, label }, i) => (
          <div key={label} style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem' }}>
            <div style={{ textAlign: 'center' }}>
              <motion.span key={val} initial={{ y: -4, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.12 }}
                style={{ display: 'block', fontFamily: "'Bebas Neue', cursive", fontSize: 'clamp(3.5rem, 14vw, 5.5rem)', lineHeight: 1, color: c.ink, letterSpacing: '0.02em' }}>
                {val}
              </motion.span>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.5rem', letterSpacing: '0.2em', color: c.inkFaint }}>{label}</span>
            </div>
            {i < 2 && <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: '4rem', color: c.inkHair, lineHeight: 1, paddingBottom: '0.4rem' }}>:</span>}
          </div>
        ))}
      </div>
    </section>
  );
}

function HonoraryCard({ name, handle, file, index }: { name: string; handle: string; file: string; index: number }) {
  const [hovered, setHovered] = useState(false);
  const rotations = [-2, 1.5, -1, 2.5, -1.5, 1, -2, 1.5, -0.5];
  const rot = rotations[index % rotations.length];
  return (
    <motion.a href={`https://x.com/${handle.replace('@', '')}`} target="_blank" rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20, rotate: rot }} whileInView={{ opacity: 1, y: 0, rotate: rot }}
      whileHover={{ rotate: 0, scale: 1.05, zIndex: 10 }} viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
      onHoverStart={() => setHovered(true)} onHoverEnd={() => setHovered(false)}
      style={{
        display: 'block', textDecoration: 'none', background: c.white,
        border: `3px solid ${c.ink}`, padding: '10px 10px 14px',
        boxShadow: hovered ? `5px 5px 0 ${c.ink}` : `3px 3px 0 ${c.inkHair}`,
        transition: 'box-shadow 0.15s', cursor: 'pointer', flexShrink: 0, width: 140,
      }}>
      <div style={{ width: '100%', aspectRatio: '1', overflow: 'hidden', background: c.paper, marginBottom: 10 }}>
        <img src={`/one/${file}`} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: 'contrast(1.05)' }}
          onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
      </div>
      <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.62rem', fontWeight: 700, color: c.ink, margin: 0, letterSpacing: '0.04em' }}>{name}</p>
      <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.55rem', color: c.inkFaint, margin: '2px 0 0', letterSpacing: '0.02em' }}>{handle}</p>
    </motion.a>
  );
}

function HonorariesSection() {
  const [isPaused, setIsPaused] = useState(false);
  return (
    <section style={{ width: '100%', padding: '4rem 0', overflow: 'hidden' }}>
      <div style={{ maxWidth: 640, margin: '0 auto', paddingLeft: '1.25rem' }}>
        <SectionLabel>1/1 Honoraries</SectionLabel>
      </div>
      <div style={{ overflow: 'hidden', cursor: 'grab' }}
        onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
        <motion.div
          style={{ display: 'flex', gap: 20, padding: '1rem 1.25rem 2rem' }}
          animate={{ x: isPaused ? undefined : [0, -(HONORARIES.length * 160)] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'linear', repeatType: 'loop' }}>
          {[...HONORARIES, ...HONORARIES].map((h, i) => (
            <HonoraryCard key={`${h.name}-${i}`} {...h} index={i % HONORARIES.length} />
          ))}
        </motion.div>
      </div>
      <p style={{ maxWidth: 640, margin: '0 auto', paddingLeft: '1.25rem', fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', color: c.inkFaint, letterSpacing: '0.1em' }}>
        HAND-DRAWN · 1/1 · GIFTED TO THE COMMUNITY
      </p>
    </section>
  );
}

function CollectionSection() {
  return (
    <section style={{ width: '100%', maxWidth: 640, padding: '4rem 0' }}>
      <SectionLabel>The Collection</SectionLabel>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 3 }}>
        {COLLECTION_PREVIEW.map((file, i) => (
          <motion.div key={file} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-20px' }} transition={{ delay: i * 0.05 }}
            whileHover={{ scale: 1.02 }}
            style={{ aspectRatio: '1', background: c.paper, border: `2px solid ${c.inkHair}`, overflow: 'hidden', cursor: 'pointer' }}>
            <img src={`/${file}`} alt={`Minizen #${file.replace('.JPG', '')}`}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: 'contrast(1.08)' }}
              onError={e => { const el = e.target as HTMLImageElement; el.style.display = 'none'; el.parentElement!.style.background = c.paperDark; }} />
          </motion.div>
        ))}
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={`tease-${i}`} style={{ aspectRatio: '1', background: c.ink, border: `2px solid ${c.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: '2.5rem', color: c.white, opacity: 0.15 }}>?</span>
          </div>
        ))}
      </div>
      <p style={{ marginTop: '1rem', fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', color: c.inkFaint, letterSpacing: '0.1em' }}>
        10,000 SUPPLY · MORE REVEALED SOON
      </p>
    </section>
  );
}

function ConfirmModal({ onYes, onNo }: { onYes: () => void; onNo: () => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(245,242,238,0.85)', backdropFilter: 'blur(6px)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.25rem' }}
      onClick={onNo}>
      <motion.div initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 10, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
        onClick={e => e.stopPropagation()}
        style={{ background: c.white, border: `3px solid ${c.ink}`, boxShadow: `6px 6px 0 ${c.ink}`, width: '100%', maxWidth: 340, padding: '2.25rem 2rem', textAlign: 'center' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '1rem', lineHeight: 1 }}>◉</div>
        <h2 style={{ fontFamily: "'Permanent Marker', cursive", fontSize: '2rem', color: c.ink, marginBottom: '0.5rem' }}>
          You a Minizen?
        </h2>
        <p style={{ fontFamily: "'Caveat', cursive", fontSize: '1.1rem', color: c.inkLight, lineHeight: 1.7, marginBottom: '2rem' }}>
          Hand-drawn. No hype. Just the work.
        </p>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onNo} style={{ ...ghostBtn, flex: 1, padding: '0.85rem' }}>Nah</button>
          <button onClick={onYes} style={{ ...inkBtn, flex: 2, padding: '0.85rem' }}>Let me in →</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function WhitelistModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [wallet, setWallet] = useState('');
  const [xLink, setXLink] = useState('');
  const [done, setDone] = useState<Set<TaskKey>>(new Set());
  const [inputs, setInputs] = useState<Partial<Record<TaskKey, string>>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const openTask = (task: typeof TASKS[0]) => {
    window.open(task.url, '_blank', 'noopener');
    setDone(prev => new Set([...prev, task.key]));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!wallet.trim()) e.wallet = 'Required';
    else if (!/^0x[a-fA-F0-9]{40}$/.test(wallet.trim())) e.wallet = 'Invalid EVM address (0x…)';
    if (!xLink.trim()) e.xLink = 'Required';
    if (done.has('quote') && !inputs.quote?.trim()) e.quote = 'Paste your quote tweet link';
    return e;
  };

  const submit = async () => {
    const e = validate(); setErrors(e);
    if (Object.keys(e).length) return;
    setSubmitting(true);
    try {
      await submitApplication({ evmAddress: wallet.trim(), xUsername: xLink.trim(), quoteTweet: inputs.quote?.trim() || xLink.trim() });
      onSuccess();
    } catch { setErrors({ submit: 'Submission failed. Try again.' }); }
    finally { setSubmitting(false); }
  };

  const lbl: React.CSSProperties = { display: 'block', fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: c.inkLight, marginBottom: 6 };
  const errStyle: React.CSSProperties = { fontFamily: "'Space Mono', monospace", fontSize: '0.65rem', color: '#c00', marginTop: 4 };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(245,242,238,0.85)', backdropFilter: 'blur(6px)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.25rem' }}
      onClick={onClose}>
      <motion.div initial={{ y: 32, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 14, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 280, damping: 26 }}
        onClick={e => e.stopPropagation()}
        style={{ background: c.white, border: `3px solid ${c.ink}`, boxShadow: `8px 8px 0 ${c.ink}`, width: '100%', maxWidth: 480, maxHeight: '90vh', overflowY: 'auto', padding: '2rem 1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.75rem' }}>
          <div>
            <h2 style={{ fontFamily: "'Permanent Marker', cursive", fontSize: '1.6rem', color: c.ink, lineHeight: 1 }}>
              Allowlist Application
            </h2>
            <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.65rem', color: c.inkFaint, marginTop: 4, letterSpacing: '0.08em' }}>
              10,000 supply · Hand-drawn
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'monospace', fontSize: '1.1rem', color: c.inkLight, padding: '2px 6px' }}>✕</button>
        </div>

        <label style={lbl}>Complete tasks</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: '1.5rem' }}>
          {TASKS.map(task => {
            const isDone = done.has(task.key);
            return (
              <div key={task.key}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', background: isDone ? c.ink : c.paper, border: `2px solid ${c.ink}`, transition: 'background 0.2s' }}>
                  <div style={{ width: 18, height: 18, border: `2px solid ${isDone ? c.white : c.ink}`, background: isDone ? c.white : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s' }}>
                    {isDone && <span style={{ fontSize: '0.6rem', color: c.ink, fontWeight: 900 }}>✓</span>}
                  </div>
                  <span style={{ flex: 1, fontFamily: "'Space Mono', monospace", fontSize: '0.75rem', color: isDone ? c.white : c.ink, fontWeight: 700, transition: 'color 0.2s' }}>{task.label}</span>
                  <button onClick={() => openTask(task)} style={{ background: isDone ? 'transparent' : c.ink, border: `2px solid ${isDone ? 'rgba(255,255,255,0.3)' : c.ink}`, color: isDone ? 'rgba(255,255,255,0.5)' : c.white, fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: '0.65rem', padding: '4px 10px', cursor: 'pointer', letterSpacing: '0.06em' }}>
                    {isDone ? 'Done' : 'Go →'}
                  </button>
                </div>
                {task.needsInput && isDone && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ marginTop: 4 }}>
                    <input style={fieldInput} value={inputs[task.key] || ''} onChange={e => setInputs(p => ({ ...p, [task.key]: e.target.value }))} placeholder={task.placeholder} />
                    {errors[task.key] && <p style={errStyle}>{errors[task.key]}</p>}
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={lbl}>EVM Wallet Address</label>
            <input style={fieldInput} value={wallet} onChange={e => setWallet(e.target.value)} placeholder="0x…" />
            {errors.wallet && <p style={errStyle}>{errors.wallet}</p>}
          </div>
          <div>
            <label style={lbl}>X Profile Link or @handle</label>
            <input style={fieldInput} value={xLink} onChange={e => setXLink(e.target.value)} placeholder="https://x.com/yourhandle" />
            {errors.xLink && <p style={errStyle}>{errors.xLink}</p>}
          </div>
        </div>

        {errors.submit && <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.7rem', color: '#c00', textAlign: 'center', marginTop: '1rem' }}>{errors.submit}</p>}
        <button onClick={submit} disabled={submitting} style={{ ...inkBtn, width: '100%', marginTop: '1.5rem', padding: '1rem', opacity: submitting ? 0.6 : 1 }}>
          {submitting ? 'Submitting···' : 'Submit Application →'}
        </button>
        <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', color: c.inkFaint, textAlign: 'center', marginTop: '1rem', lineHeight: 1.6 }}>
          Quote links are manually reviewed · No bots
        </p>
      </motion.div>
    </motion.div>
  );
}

function SuccessModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(245,242,238,0.85)', backdropFilter: 'blur(6px)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.25rem' }}>
      <motion.div initial={{ scale: 0.88, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        style={{ background: c.white, border: `3px solid ${c.ink}`, boxShadow: `8px 8px 0 ${c.ink}`, width: '100%', maxWidth: 340, padding: '2.5rem 2rem', textAlign: 'center' }}>
        <motion.div animate={{ rotate: [0, -8, 8, -4, 4, 0] }} transition={{ duration: 0.5, delay: 0.2 }}
          style={{ fontSize: '3rem', marginBottom: '1.25rem', lineHeight: 1 }}>◉</motion.div>
        <h2 style={{ fontFamily: "'Permanent Marker', cursive", fontSize: '1.8rem', color: c.ink, marginBottom: '0.5rem' }}>
          You're In The Queue
        </h2>
        <p style={{ fontFamily: "'Caveat', cursive", fontSize: '1.15rem', color: c.inkLight, lineHeight: 1.8, marginBottom: '1.75rem' }}>
          Application received. We review manually. Turn on notifs @minizenhq.
        </p>
        <button onClick={onClose} style={{ ...inkBtn, width: '100%', padding: '0.9rem' }}>Close</button>
      </motion.div>
    </motion.div>
  );
}

export default function Home() {
  const [step, setStep] = useState<Step>('idle');

  return (
    <div style={{ minHeight: '100vh', background: c.bg, color: c.ink, fontFamily: "'Space Mono', monospace" }}>
      <NoiseOverlay />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:wght@400;700&family=Permanent+Marker&family=Caveat:wght@400;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${c.bg}; }
        ::selection { background: ${c.ink}; color: ${c.white}; }
        input::placeholder { color: ${c.inkHair}; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: ${c.paper}; }
        ::-webkit-scrollbar-thumb { background: ${c.ink}; }
      `}</style>

      {/* Hero */}
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '0 1.25rem' }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
          style={{ padding: '5rem 0 3rem', position: 'relative' }}>
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
            style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1.5rem' }}>
            <div style={{ width: 8, height: 8, background: c.ink, borderRadius: '50%' }} />
            <span style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: c.inkLight }}>
              Allowlist · Season 1
            </span>
          </motion.div>

          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2rem', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 280px' }}>
              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.4 }}
                style={{ fontFamily: "'Permanent Marker', cursive", fontSize: 'clamp(3.5rem, 14vw, 6rem)', lineHeight: 0.95, color: c.ink, marginBottom: '1.5rem' }}>
                MINI<br />ZEN<br />HQ.
              </motion.h1>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                style={{ fontFamily: "'Caveat', cursive", fontSize: '1.25rem', color: c.inkLight, lineHeight: 1.7, marginBottom: '2rem', maxWidth: 320 }}>
                10,000 hand-drawn characters.<br />
                Old school lines. New school moves.<br />
                The minis are coming.
              </motion.p>
              <motion.button initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                whileHover={{ x: 3, y: -3 }}
                onClick={() => setStep('confirm')}
                style={{ ...inkBtn, fontSize: '0.82rem', padding: '1rem 2.5rem', boxShadow: `4px 4px 0 ${c.inkLight}`, transition: 'box-shadow 0.15s' }}>
                Apply for Allowlist →
              </motion.button>
            </div>

            <motion.div initial={{ opacity: 0, rotate: 3 }} animate={{ opacity: 1, rotate: 2 }} transition={{ delay: 0.2, duration: 0.5 }}
              style={{ flex: '0 0 auto', width: 'clamp(160px, 30vw, 240px)', background: c.white, border: `3px solid ${c.ink}`, padding: 10, boxShadow: `6px 6px 0 ${c.ink}`, alignSelf: 'flex-end' }}>
              <img src="/hero.png" alt="Minizen" style={{ width: '100%', display: 'block', filter: 'contrast(1.05)' }}
                onError={e => { (e.target as HTMLImageElement).src = '/517.JPG'; }} />
            </motion.div>
          </div>
        </motion.div>
      </div>

      <HatchDivider />
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '0 1.25rem' }}><StatusChecker /></div>
      <HatchDivider />
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '0 1.25rem' }}><CountdownSection /></div>
      <HatchDivider />
      <HonorariesSection />
      <HatchDivider />
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '0 1.25rem' }}><CollectionSection /></div>

      <AnimatePresence>
        {step === 'confirm' && <ConfirmModal onYes={() => setStep('form')} onNo={() => setStep('idle')} />}
        {step === 'form' && <WhitelistModal onClose={() => setStep('idle')} onSuccess={() => setStep('success')} />}
        {step === 'success' && <SuccessModal onClose={() => setStep('idle')} />}
      </AnimatePresence>
    </div>
  );
}
