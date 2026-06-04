import { motion } from 'framer-motion';
import { NoiseOverlay, HatchDivider, SectionLabel } from './Home';
import { COLLECTION_URLS, LOGO_URL } from '../lib/assets';

const c = {
  bg: '#f5f2ee', ink: '#111111', inkLight: '#444', inkFaint: '#999',
  inkHair: '#ccc', white: '#ffffff', paper: '#ede9e3', paperDark: '#ddd8d0',
};

const TRAITS = [
  { label: 'Supply', value: '10,000' },
  { label: 'Type', value: 'Hand-drawn' },
  { label: 'Honoraries', value: '1/1 gifted' },
  { label: 'Tools', value: 'Pen & paper' },
  { label: 'Season', value: '01' },
  { label: 'Status', value: 'Coming soon' },
];

export default function About() {
  return (
    <div style={{ minHeight: '100vh', background: c.bg, color: c.ink, fontFamily: "'Space Mono', monospace" }}>
      <NoiseOverlay />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:wght@400;700&family=Permanent+Marker&family=Caveat:wght@400;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${c.bg}; }
        ::selection { background: ${c.ink}; color: ${c.white}; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: ${c.paper}; }
        ::-webkit-scrollbar-thumb { background: ${c.ink}; }
      `}</style>

      {/* Header: logo only */}
      <header style={{ width: '100%', padding: '1.25rem', display: 'flex', justifyContent: 'center' }}>
        <img src={LOGO_URL} alt="Minizen HQ" style={{ height: 40, display: 'block' }} />
      </header>

      <div style={{ maxWidth: 680, margin: '0 auto', padding: '0 1.25rem' }}>

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          style={{ padding: '3rem 0 3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1.5rem' }}>
            <div style={{ width: 8, height: 8, background: c.ink, borderRadius: '50%' }} />
            <span style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: c.inkFaint }}>
              The Story
            </span>
          </div>
          <h1 style={{ fontFamily: "'Permanent Marker', cursive", fontSize: 'clamp(3rem, 12vw, 5.5rem)', lineHeight: 0.95, color: c.ink, marginBottom: '1.5rem' }}>
            ABOUT.
          </h1>

          {/* Split layout */}
          <div style={{ display: 'flex', gap: '3rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 280px' }}>
              <p style={{ fontFamily: "'Caveat', cursive", fontSize: '1.25rem', color: c.inkLight, lineHeight: 1.75, marginBottom: '1.5rem' }}>
                Minizen started with a pen and a blank page. No computer generation. No AI fill. Just someone who wanted to draw 10,000 characters and actually did it.
              </p>
              <p style={{ fontFamily: "'Caveat', cursive", fontSize: '1.25rem', color: c.inkLight, lineHeight: 1.75 }}>
                Old school cartoon energy. New school onchain. The collection is inspired by the weird and wonderful — each mini a little world of its own.
              </p>
            </div>

            {/* Stacked polaroids */}
            <div style={{ flex: '0 0 auto', position: 'relative', width: 180, height: 200 }}>
              {COLLECTION_URLS.slice(0, 3).map((url, i) => (
                <motion.div key={url}
                  initial={{ opacity: 0, rotate: (i - 1) * 5 }}
                  animate={{ opacity: 1, rotate: (i - 1) * 4 }}
                  transition={{ delay: 0.15 + i * 0.1, duration: 0.4 }}
                  style={{
                    position: 'absolute', top: i * 6, left: i * 6,
                    background: c.white, border: `3px solid ${c.ink}`,
                    padding: 8, boxShadow: `3px 3px 0 ${c.ink}`,
                    width: 150, zIndex: 3 - i,
                  }}>
                  <img src={url} alt={`Minizen`}
                    style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', display: 'block', filter: 'contrast(1.06)' }}
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <HatchDivider />

      {/* Stats / traits grid */}
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '0 1.25rem' }}>
        <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} style={{ padding: '4rem 0' }}>
          <SectionLabel>Collection Stats</SectionLabel>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 3 }}>
            {TRAITS.map(({ label, value }, i) => (
              <motion.div key={label}
                initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                style={{ background: i % 2 === 0 ? c.paper : c.white, border: `2px solid ${c.inkHair}`, padding: '1.25rem 1rem' }}>
                <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.55rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: c.inkFaint, marginBottom: 8 }}>{label}</p>
                <p style={{ fontFamily: "'Permanent Marker', cursive", fontSize: '1.4rem', color: c.ink, lineHeight: 1 }}>{value}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>

      <HatchDivider />

      {/* The art */}
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '0 1.25rem' }}>
        <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} style={{ padding: '4rem 0' }}>
          <SectionLabel>The Art</SectionLabel>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 3, marginBottom: '1.5rem' }}>
            {COLLECTION_URLS.map((url, i) => (
              <motion.div key={url}
                initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
                viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                whileHover={{ scale: 1.03, zIndex: 2 }}
                style={{ aspectRatio: '1', background: c.paper, border: `2px solid ${c.inkHair}`, overflow: 'hidden', cursor: 'pointer', position: 'relative' }}>
                <img src={url} alt={`Minizen preview`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: 'contrast(1.08)' }}
                  onError={e => { const el = e.target as HTMLImageElement; el.style.display = 'none'; el.parentElement!.style.background = c.paperDark; }} />
              </motion.div>
            ))}
          </div>
          <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', color: c.inkFaint, letterSpacing: '0.1em' }}>
            PREVIEW ONLY · FULL COLLECTION REVEALED AT MINT
          </p>
        </motion.section>
      </div>

      <HatchDivider />

      {/* Manifesto */}
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '0 1.25rem' }}>
        <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} style={{ padding: '4rem 0' }}>
          <SectionLabel>The Ethos</SectionLabel>

          <div style={{ borderLeft: `4px solid ${c.ink}`, paddingLeft: '1.5rem', marginBottom: '2.5rem' }}>
            <p style={{ fontFamily: "'Permanent Marker', cursive", fontSize: 'clamp(1.4rem, 5vw, 2rem)', color: c.ink, lineHeight: 1.4 }}>
              "Draw your own path."
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {[
              'No AI. No shortcuts. No corners cut.',
              'The web3 space is full of generated noise. Minizen is the opposite — a collection built on the patience of drawing each character by hand.',
              'The community comes first. The honoraries exist because real supporters deserve to hold something real.',
              'We\'re not rushing. The mint happens when it\'s ready. The art takes as long as it takes.',
            ].map((text, i) => (
              <motion.p key={i} initial={{ opacity: 0, x: -8 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                style={{ fontFamily: "'Caveat', cursive", fontSize: '1.15rem', color: i === 0 ? c.ink : c.inkLight, lineHeight: 1.7, fontWeight: i === 0 ? 700 : 400 }}>
                {text}
              </motion.p>
            ))}
          </div>
        </motion.section>
      </div>

      <HatchDivider />

      {/* CTA */}
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '0 1.25rem' }}>
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          style={{ padding: '4rem 0', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start' }}>
          <p style={{ fontFamily: "'Caveat', cursive", fontSize: '1.35rem', color: c.inkFaint }}>
            Ready to be a Minizen?
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <a href="/" style={{ display: 'inline-block', background: c.ink, color: c.white, fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.85rem 1.75rem', textDecoration: 'none', border: `2px solid ${c.ink}`, boxShadow: `4px 4px 0 ${c.inkLight}` }}>
              Apply for Allowlist →
            </a>
            <a href="https://x.com/minizenhq?s=21" target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'transparent', color: c.ink, fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.85rem 1.75rem', textDecoration: 'none', border: `2px solid ${c.ink}` }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              Follow @minizenhq
            </a>
          </div>
        </motion.div>
      </div>

    </div>
  );
}
