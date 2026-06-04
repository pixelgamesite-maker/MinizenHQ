const BASE = 'https://qrumjpbongudckjdjcls.supabase.co/storage/v1/object/public/Minizen';

// ── Site assets ───────────────────────────────────────────────────────────────
export const LOGO_URL  = `${BASE}/Assets/logo.png`;
export const HERO_URL  = `${BASE}/Assets/hero.png`;

// ── Collection preview (515–521) ──────────────────────────────────────────────
export const COLLECTION_URLS = [
  '515.JPG',
  '516.JPG',
  '517.JPG',
  '518.JPG',
  '519.JPG',
  '520.JPG',
  '521.JPG',
].map(f => `${BASE}/Collection/${f}`);

// ── 1/1 Honoraries ────────────────────────────────────────────────────────────
export const HONORARIES = [
  { name: 'TMA',     handle: '@tma_420',       url: `${BASE}/One/TMA.JPG` },
  { name: 'Brated',  handle: '@br4ted',        url: `${BASE}/One/Brated.JPG` },
  { name: 'SafZ',    handle: '@crypsaf',       url: `${BASE}/One/SafZ.JPG` },
  { name: 'Jasich',  handle: '@thejasich',     url: `${BASE}/One/Jasich.JPG` },
  { name: 'Kelvin',  handle: '@kelvinoyibo2',  url: `${BASE}/One/H0ld%20.JPG` },
  { name: 'Tess',    handle: '@tessonchain',   url: `${BASE}/One/Tess.JPG` },
  { name: 'Smart',   handle: '@xmartsol',      url: `${BASE}/One/Smart.JPG` },
  { name: 'Gorilla', handle: '@cryptogorilla', url: `${BASE}/One/Gorilla.JPG` },
  { name: 'JBond',   handle: '@jbondwagon',    url: `${BASE}/One/JBond.JPG` },
];
