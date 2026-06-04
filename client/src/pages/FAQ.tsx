import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NoiseOverlay, HatchDivider, SectionLabel } from './Home';

const c = {
  bg: '#f5f2ee', ink: '#111111', inkLight: '#444', inkFaint: '#999',
  inkHair: '#ccc', white: '#ffffff', paper: '#ede9e3',
};

const FAQS = [
  {
    category: 'The Basics',
    items: [
      { q: 'What is Minizen?', a: 'Minizen is a 10,000 piece hand-drawn NFT collection. Old school cartoon energy, new school onchain. Every single one drawn by hand — no AI generation, no shortcuts.' },
      { q: 'How many are there?', a: '10,000 total supply. Each one unique. A handful of 1/1 honoraries gifted to community members who were there from the jump.' },
      { q: 'What makes them special?', a: 'They\'re actually drawn. By a human. With a pen. In a world of generated slop, that means something.' },
    ],
  },
  {
    category: 'The Allowlist',
    items: [
      { q: 'How do I get on the allowlist?', a: 'Follow @minizenhq, retweet and quote tweet the main post, then submit your wallet below. Simple. No Discord, no grinding, no points.' },
      { q: 'How long does review take?', a: 'We review manually. Could be a few hours, could be a day. We check every submission. Turn on notifications at @minizenhq for updates.' },
      { q: 'Can I check my application status?', a: 'Yes — use the status checker on the homepage. Paste your wallet address and it\'ll tell you if you\'re approved, pending, or not selected.' },
      { q: 'What if I get rejected?', a: 'Not everyone makes the cut for Season 1. Follow @minizenhq — there will be more opportunities.' },
    ],
  },
  {
    category: 'The Mint',
    items: [
      { q: 'Is the mint free?', a: 'Allowlist details TBA. Follow @minizenhq for updates. We\'ll announce everything there first.' },
      { q: 'What chain?', a: 'TBA. Follow @minizenhq for the announcement. We\'re choosing carefully.' },
      { q: 'When is the mint?', a: 'Soon. Stay locked. We don\'t rush things.' },
      { q: 'Will there be a public mint?', a: 'Possibly. Allowlist gets priority. Details coming.' },
    ],
  },
  {
    category: 'The Honoraries',
    items: [
      { q: 'What are the 1/1 honoraries?', a: 'Hand-drawn, one-of-a-kind pieces gifted to community members who showed love early. No sale, no auction — just appreciation.' },
      { q: 'Can I get an honorary?', a: 'Honoraries are gifted at our discretion to people who genuinely support the project. No DMs asking for one — that\'s a fast way to not get one.' },
    ],
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<string | null>(null);

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

      <div style={{ maxWidth: 680, margin: '0 auto', padding: '0 1.25rem' }}>
        {/* Page header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          style={{ padding: '5rem 0 3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1.5rem' }}>
            <div style={{ width: 8, height: 8, background: c.ink, borderRadius: '50%' }} />
            <span style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: c.inkFaint }}>
              Frequently Asked
            </span>
          </div>
          <h1 style={{ fontFamily: "'Permanent Marker', cursive", fontSize: 'clamp(3rem, 12vw, 5.5rem)', lineHeight: 0.95, color: c.ink, marginBottom: '1.25rem' }}>
            FAQ.
          </h1>
          <p style={{ fontFamily: "'Caveat', cursive", fontSize: '1.2rem', color: c.inkLight, lineHeight: 1.7, maxWidth: 400 }}>
            Everything you need to know.<br />
            If it's not here, ask on X.
          </p>
        </motion.div>
      </div>

      <HatchDivider />

      <div style={{ maxWidth: 680, margin: '0 auto', padding: '0 1.25rem' }}>
        {FAQS.map((section, si) => (
          <motion.section key={section.category}
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }} transition={{ delay: si * 0.08 }}
            style={{ padding: '4rem 0' }}>
            <SectionLabel>{section.category}</SectionLabel>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {section.items.map((faq, i) => {
                const key = `${si}-${i}`;
                const isOpen = open === key;
                return (
                  <div key={i} style={{ borderTop: `2px solid ${c.ink}`, borderBottom: i === section.items.length - 1 ? `2px solid ${c.ink}` : 'none' }}>
                    <button
                      onClick={() => setOpen(isOpen ? null : key)}
                      style={{ width: '100%', background: 'transparent', border: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.1rem 0', cursor: 'pointer', textAlign: 'left' }}>
                      <span style={{ fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: '0.82rem', color: c.ink, letterSpacing: '0.02em', paddingRight: '1rem' }}>
                        {faq.q}
                      </span>
                      <motion.span animate={{ rotate: isOpen ? 45 : 0 }}
                        style={{ fontFamily: 'monospace', fontSize: '1.4rem', color: c.ink, flexShrink: 0 }}>+</motion.span>
                    </button>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }} style={{ overflow: 'hidden' }}>
                          <p style={{ fontFamily: "'Caveat', cursive", fontSize: '1.15rem', color: c.inkLight, lineHeight: 1.7, paddingBottom: '1.25rem', margin: 0 }}>
                            {faq.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </motion.section>
        ))}

        {/* Still have questions */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          style={{ padding: '4rem 0', borderTop: `2px solid ${c.inkHair}` }}>
          <p style={{ fontFamily: "'Caveat', cursive", fontSize: '1.4rem', color: c.inkFaint, marginBottom: '1rem' }}>
            Still got questions?
          </p>
          <a href="https://x.com/minizenhq?s=21" target="_blank" rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: c.ink, color: c.white, fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.85rem 1.75rem', textDecoration: 'none', border: `2px solid ${c.ink}`, boxShadow: `4px 4px 0 ${c.inkLight}` }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            Ask @minizenhq →
          </a>
        </motion.div>
      </div>
    </div>
  );
}
