import { useState, type CSSProperties } from 'react'
import { Petal } from './Flowers'

const COLORS = ['#fb7185', '#f43f5e', '#fda4af', '#e11d48']

// Soft, slow petals drifting down behind the page.
export default function PetalField({ count = 12 }: { count?: number }) {
  const [petals] = useState(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      dur: 16 + Math.random() * 14,
      delay: -Math.random() * 28,
      sway: (Math.random() - 0.5) * 160,
      size: 12 + Math.random() * 12,
      color: COLORS[i % COLORS.length],
    }))
  )

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden opacity-40" aria-hidden="true">
      {petals.map((p) => (
        <div
          key={p.id}
          className="petal-fall"
          style={{ left: `${p.left}%`, '--dur': `${p.dur}s`, '--delay': `${p.delay}s`, '--sway': `${p.sway}px` } as CSSProperties}
        >
          <Petal size={p.size} color={p.color} />
        </div>
      ))}
    </div>
  )
}
