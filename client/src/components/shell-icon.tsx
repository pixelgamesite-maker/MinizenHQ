export function ShellIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <ellipse cx="16" cy="19" rx="11" ry="8" fill="url(#si1)" />
      <path d="M5 19 Q6 10 16 8 Q26 10 27 19" fill="url(#si2)" />
      <path d="M16 8 Q17 13 18 19" stroke="rgba(255,255,255,0.5)" strokeWidth="0.8" fill="none" />
      <path d="M16 8 Q15 13 14 19" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" fill="none" />
      <defs>
        <linearGradient id="si1" x1="5" y1="14" x2="27" y2="27">
          <stop stopColor="#06D6A0" /><stop offset="1" stopColor="#118AB2" />
        </linearGradient>
        <linearGradient id="si2" x1="5" y1="8" x2="27" y2="19">
          <stop stopColor="#A8F5E0" /><stop offset="1" stopColor="#06D6A0" />
        </linearGradient>
      </defs>
    </svg>
  );
}
