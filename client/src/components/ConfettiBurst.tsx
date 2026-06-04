import { motion } from 'framer-motion';

export function ConfettiBurst({ active }: { active: boolean }) {
  if (!active) return null;
  const pieces = Array.from({ length: 24 }, (_, i) => ({
    id: i,
    color: ['#FF6B35','#FFD166','#06D6A0','#EF476F','#118AB2','#FFB347'][i % 6],
    angle: (i / 24) * 360,
    dist: 60 + Math.random() * 70,
  }));
  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden z-30">
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          className="absolute w-2.5 h-2.5 rounded-sm"
          style={{ background: p.color }}
          initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
          animate={{
            scale: [0, 1.2, 0.3],
            x: Math.cos((p.angle * Math.PI) / 180) * p.dist,
            y: Math.sin((p.angle * Math.PI) / 180) * p.dist,
            rotate: [0, 360],
            opacity: [1, 1, 0],
          }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
        />
      ))}
    </div>
  );
}
