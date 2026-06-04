// pages/Home.tsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { submitApplication, checkStatus, type ApplicationStatus } from '../lib/supabase';

type Step = 'idle' | 'confirm' | 'form' | 'success';
type TaskKey = 'follow' | 'retweet' | 'quote' | 'comment';

const TASKS = [
  {
    key: 'follow' as TaskKey,
    label: 'Follow @outworld3rs',
    url: 'https://x.com/outworld3rs?s=21',
  },
  {
    key: 'retweet' as TaskKey,
    label: 'Retweet the post',
    url: 'https://x.com/outworld3rs/status/2052376246986948946?s=46',
  },
  {
    key: 'quote' as TaskKey,
    label: 'Quote tweet the post',
    url: 'https://x.com/outworld3rs/status/2052376246986948946?s=46',
    needsInput: true,
    placeholder: 'Paste your quote tweet link',
  },
  {
    key: 'comment' as TaskKey,
    label: 'Comment on the post',
    url: 'https://x.com/outworld3rs/status/2052376246986948946?s=46',
    needsInput: true,
    placeholder: 'Paste your comment link',
  },
];

const DURATION = 72 * 60 * 60;

function getEnd() {
  const s = sessionStorage.getItem('ow_end');
  if (s) return parseInt(s);
  const e = Date.now() + DURATION * 1000;
  sessionStorage.setItem('ow_end', String(e));
  return e;
}

function useCountdown() {
  const [secs, setSecs] = useState(0);
  useEffect(() => {
    const tick = () => setSecs(Math.max(0, Math.floor((getEnd() - Date.now()) / 1000)));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return {
    h: Math.floor(secs / 3600),
    m: Math.floor((secs % 3600) / 60),
    s: secs % 60,
  };
}

const pad = (n: number) => String(n).padStart(2, '0');

const STATUS_MAP: Record<ApplicationStatus, { label: string; color: string }> = {
  approved:  { label: '✓ Whitelisted',  color: '#10b981' },
  pending:   { label: '◌ Under Review', color: '#f59e0b' },
  rejected:  { label: '✕ Not Selected', color: '#ef4444' },
  not_found: { label: '— Not Found',    color: '#444' },
};

// ── Shared style tokens ───────────────────────────────────────────────────────
const c = {
  bg: '#0f0f0f',
  surface: '#161616',
  border: '#222',
  borderSub: '#1a1a1a',
  white: '#ffffff',
  muted: '#555',
  dim: '#333',
};

const fieldInput: React.CSSProperties = {
  width: '100%',
  background: c.surface,
  border: `1px solid ${c.border}`,
  borderRadius: '8px',
  color: c.white,
  fontFamily: "'Syne', sans-serif",
  fontSize: '0.85rem',
  padding: '0.75rem 1rem',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s',
};

// ── Status Checker ────────────────────────────────────────────────────────────
function StatusChecker() {
  const [wallet, setWallet] = useState('');
  const [status, setStatus] = useState<ApplicationStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const check = async () => {
    if (!wallet.trim()) return;
    setLoading(true); setErr(''); setStatus(null);
    try { setStatus(await checkStatus(wallet.trim())); }
    catch { setErr('Connection failed. Try again.'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ width: '100%', maxWidth: '640px', padding: '2.5rem 0' }}>
      <span style={{ display: 'block', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: c.muted, marginBottom: '1rem' }}>
        Check Whitelist Status
      </span>
      <div style={{ display: 'flex', gap: '8px' }}>
        <input
          style={{ ...fieldInput, flex: 1 }}
          value={wallet}
          onChange={e => setWallet(e.target.value)}
          placeholder="Your EVM wallet address"
          onKeyDown={e => e.key === 'Enter' && check()}
        />
        <button
          onClick={check}
          disabled={loading || !wallet.trim()}
          style={{ background: 'transparent', border: `1px solid ${c.border}`, borderRadius: '8px', color: c.muted, fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.08em', padding: '0.75rem 1.25rem', cursor: 'pointer', whiteSpace: 'nowrap' }}
        >
          {loading ? '…' : 'Check'}
        </button>
      </div>
      <AnimatePresence>
        {status && (
          <motion.p initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{ marginTop: '10px', fontSize: '0.8rem', fontWeight: 700, color: STATUS_MAP[status].color }}>
            {STATUS_MAP[status].label}
          </motion.p>
        )}
        {err && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ marginTop: '8px', fontSize: '0.75rem', color: '#e74c3c' }}>
            {err}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Countdown ─────────────────────────────────────────────────────────────────
function CountdownSection() {
  const { h, m, s } = useCountdown();
  return (
    <div style={{ width: '100%', maxWidth: '640px', padding: '2.5rem 0', textAlign: 'center' }}>
      <span style={{ display: 'block', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: c.muted, marginBottom: '1.5rem' }}>
        Whitelist closes in
      </span>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', gap: '0.25rem' }}>
        {[{ val: pad(h), label: 'Hours' }, { val: pad(m), label: 'Mins' }, { val: pad(s), label: 'Secs' }].map(({ val, label }, i) => (
          <>
            <div key={label} style={{ textAlign: 'center', minWidth: '64px' }}>
              <motion.span key={val} initial={{ y: -6, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.15 }}
                style={{ display: 'block', fontFamily: "'Cinzel', serif", fontSize: 'clamp(2rem, 8vw, 2.8rem)', fontWeight: 900, color: c.white, lineHeight: 1 }}>
                {val}
              </motion.span>
              <span style={{ display: 'block', fontSize: '0.55rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: c.dim, marginTop: '6px' }}>
                {label}
              </span>
            </div>
            {i < 2 && <span style={{ fontFamily: "'Cinzel', serif", fontSize: '2rem', color: c.dim, lineHeight: 1, paddingTop: '2px', userSelect: 'none' }}>:</span>}
          </>
        ))}
      </div>
    </div>
  );
}

// ── Confirm popup ─────────────────────────────────────────────────────────────
function ConfirmModal({ onYes, onNo }: { onYes: () => void; onNo: () => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.25rem' }}
      onClick={onNo}>
      <motion.div
        initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 10, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        onClick={e => e.stopPropagation()}
        style={{ background: '#141414', border: `1px solid ${c.border}`, borderRadius: '12px', width: '100%', maxWidth: '340px', padding: '2rem 1.75rem', textAlign: 'center' }}>
        <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.25rem', fontWeight: 900, color: c.white, marginBottom: '0.75rem', letterSpacing: '0.04em' }}>
          Are you an Outsider?
        </h2>
        <p style={{ fontSize: '0.85rem', color: c.muted, lineHeight: 1.6, marginBottom: '2rem' }}>
          We're all outsiders one way or another.
        </p>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={onNo} style={{ flex: 1, background: 'transparent', border: `1px solid ${c.border}`, borderRadius: '8px', color: c.muted, fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '0.8rem', padding: '0.85rem', cursor: 'pointer' }}>
            Not yet
          </button>
          <button onClick={onYes} style={{ flex: 2, background: c.white, color: c.bg, border: 'none', borderRadius: '8px', fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '0.85rem', letterSpacing: '0.06em', padding: '0.85rem', cursor: 'pointer' }}>
            Yes, I'm in
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Whitelist form ────────────────────────────────────────────────────────────
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
    else if (!/^0x[a-fA-F0-9]{40}$/.test(wallet.trim())) e.wallet = 'Enter a valid EVM address (0x…)';
    if (!xLink.trim()) e.xLink = 'Required';
    if (done.has('quote') && !inputs.quote?.trim()) e.quote = 'Paste your quote link';
    if (done.has('comment') && !inputs.comment?.trim()) e.comment = 'Paste your comment link';
    return e;
  };

  const submit = async () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    setSubmitting(true);
    try {
      await submitApplication({ wallet: wallet.trim(), x_link: xLink.trim(), quote_link: inputs.quote?.trim(), comment_link: inputs.comment?.trim(), tasks_done: Array.from(done) });
      onSuccess();
    } catch {
      setErrors({ submit: 'Submission failed. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  const lbl: React.CSSProperties = { display: 'block', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: c.muted, marginBottom: '6px' };
  const err: React.CSSProperties = { fontSize: '0.7rem', color: '#e74c3c', marginTop: '4px' };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.25rem' }}
      onClick={onClose}>
      <motion.div
        initial={{ y: 28, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 12, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 280, damping: 28 }}
        onClick={e => e.stopPropagation()}
        style={{ background: '#141414', border: `1px solid ${c.border}`, borderRadius: '12px', width: '100%', maxWidth: '480px', maxHeight: '90vh', overflowY: 'auto', padding: '2rem 1.75rem' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.75rem' }}>
          <div>
            <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.2rem', fontWeight: 900, color: c.white, letterSpacing: '0.04em' }}>Whitelist Application</h2>
            <p style={{ fontSize: '0.75rem', color: c.muted, marginTop: '3px' }}>950 supply · OpenSea</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: c.muted, fontSize: '1rem', cursor: 'pointer', padding: '2px 6px' }}>✕</button>
        </div>

        {/* Tasks */}
        <label style={lbl}>Complete tasks</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '1.5rem' }}>
          {TASKS.map(task => {
            const isDone = done.has(task.key);
            return (
              <div key={task.key}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', background: c.surface, border: `1px solid ${isDone ? c.border : c.borderSub}`, borderRadius: '8px' }}>
                  <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: `1.5px solid ${isDone ? c.white : c.dim}`, background: isDone ? c.white : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s' }}>
                    {isDone && <span style={{ fontSize: '0.55rem', color: c.bg, fontWeight: 900 }}>✓</span>}
                  </div>
                  <span style={{ flex: 1, fontSize: '0.82rem', color: isDone ? c.white : c.muted, transition: 'color 0.2s' }}>{task.label}</span>
                  <button onClick={() => openTask(task)}
                    style={{ background: 'transparent', border: `1px solid ${c.border}`, borderRadius: '6px', color: isDone ? c.dim : '#777', fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '0.7rem', padding: '4px 12px', cursor: 'pointer' }}>
                    {isDone ? 'Done' : 'Go →'}
                  </button>
                </div>
                {task.needsInput && isDone && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ marginTop: '6px', paddingLeft: '30px' }}>
                    <input style={fieldInput} value={inputs[task.key] || ''} onChange={e => setInputs(p => ({ ...p, [task.key]: e.target.value }))} placeholder={task.placeholder} />
                    {errors[task.key] && <p style={err}>{errors[task.key]}</p>}
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>

        {/* Fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={lbl}>EVM Wallet Address</label>
            <input style={fieldInput} value={wallet} onChange={e => setWallet(e.target.value)} placeholder="0x…" />
            {errors.wallet && <p style={err}>{errors.wallet}</p>}
          </div>
          <div>
            <label style={lbl}>X Profile Link</label>
            <input style={fieldInput} value={xLink} onChange={e => setXLink(e.target.value)} placeholder="https://x.com/yourhandle" />
            {errors.xLink && <p style={err}>{errors.xLink}</p>}
          </div>
        </div>

        {errors.submit && <p style={{ fontSize: '0.75rem', color: '#e74c3c', textAlign: 'center', marginTop: '1rem' }}>{errors.submit}</p>}

        <button onClick={submit} disabled={submitting}
          style={{ width: '100%', background: c.white, color: c.bg, border: 'none', borderRadius: '8px', fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.9rem', cursor: 'pointer', marginTop: '1.5rem', opacity: submitting ? 0.6 : 1 }}>
          {submitting ? 'Submitting…' : 'Submit Application'}
        </button>

        <p style={{ fontSize: '0.65rem', color: c.dim, textAlign: 'center', marginTop: '1rem', lineHeight: 1.5 }}>
          Quote & comment links are manually reviewed.
        </p>
      </motion.div>
    </motion.div>
  );
}

// ── Success ───────────────────────────────────────────────────────────────────
function SuccessModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.25rem' }}>
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 24 }}
        style={{ background: '#141414', border: `1px solid ${c.border}`, borderRadius: '12px', width: '100%', maxWidth: '340px', padding: '2.25rem 1.75rem', textAlign: 'center' }}>
        <p style={{ fontSize: '2rem', marginBottom: '1.25rem' }}>✦</p>
        <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.2rem', fontWeight: 900, color: c.white, letterSpacing: '0.04em', marginBottom: '0.75rem' }}>
          Application Received
        </h2>
        <p style={{ fontSize: '0.82rem', color: c.muted, lineHeight: 1.7, marginBottom: '1.75rem' }}>
          We'll review your submission and whitelist approved Outworlders. Notifs on.
        </p>
        <button onClick={onClose}
          style={{ width: '100%', background: c.white, color: c.bg, border: 'none', borderRadius: '8px', fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '0.85rem', letterSpacing: '0.1em', padding: '0.9rem', cursor: 'pointer' }}>
          Close
        </button>
      </motion.div>
    </motion.div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function Home() {
  const [step, setStep] = useState<Step>('idle');

  return (
    <div style={{ minHeight: '100vh', background: c.bg, color: c.white, fontFamily: "'Syne', sans-serif", display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 1.25rem' }}>

      {/* Nav */}
      <nav style={{ width: '100%', maxWidth: '640px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem 0', borderBottom: `1px solid ${c.borderSub}` }}>
        <span style={{ fontFamily: "'Cinzel', serif", fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.2em' }}>OUTWORLDERS</span>
        <a href="https://x.com/outworld3rs?s=21" target="_blank" rel="noopener noreferrer"
          style={{ display: 'flex', alignItems: 'center', gap: '6px', color: c.muted, fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textDecoration: 'none', textTransform: 'uppercase' }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
          @outworld3rs
        </a>
      </nav>

      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
        style={{ width: '100%', maxWidth: '640px', paddingTop: '5rem', paddingBottom: '4.5rem', textAlign: 'center' }}>
        <span style={{ display: 'inline-block', fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: c.muted, marginBottom: '1.5rem' }}>
          Whitelist · Season 1
        </span>
        <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(3rem, 12vw, 5.5rem)', fontWeight: 900, lineHeight: 1.0, letterSpacing: '0.04em', color: c.white, marginBottom: '1.5rem' }}>
          OUT<br />WORLDERS.
        </h1>
        <p style={{ fontSize: '0.95rem', color: c.muted, lineHeight: 1.8, marginBottom: '2.5rem' }}>
          950 supply. Launching on OpenSea.<br />
          A different kind of entity.
        </p>
        <button
          onClick={() => setStep('confirm')}
          style={{ display: 'inline-block', background: c.white, color: c.bg, fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '0.85rem', letterSpacing: '0.12em', textTransform: 'uppercase', border: 'none', borderRadius: '8px', padding: '1rem 2.5rem', cursor: 'pointer', width: '100%', maxWidth: '280px' }}>
          Apply for Whitelist
        </button>
      </motion.div>

      {/* Divider */}
      <div style={{ width: '100%', maxWidth: '640px', height: '1px', background: c.borderSub }} />

      {/* Status */}
      <StatusChecker />

      {/* Divider */}
      <div style={{ width: '100%', maxWidth: '640px', height: '1px', background: c.borderSub }} />

      {/* Countdown */}
      <CountdownSection />

      {/* Footer */}
      <div style={{ width: '100%', maxWidth: '640px', height: '1px', background: c.borderSub, marginBottom: '2rem' }} />
      <p style={{ fontSize: '0.65rem', color: c.dim, paddingBottom: '2rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
        © 2025 Out Worlders · Embrace the abyss.
      </p>

      {/* Modals */}
      <AnimatePresence>
        {step === 'confirm' && <ConfirmModal onYes={() => setStep('form')} onNo={() => setStep('idle')} />}
        {step === 'form' && <WhitelistModal onClose={() => setStep('idle')} onSuccess={() => setStep('success')} />}
        {step === 'success' && <SuccessModal onClose={() => setStep('idle')} />}
      </AnimatePresence>
    </div>
  );
}
