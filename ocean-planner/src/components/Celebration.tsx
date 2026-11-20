import { useEffect, useState, type CSSProperties } from 'react'
import CartoonSlot from './CartoonSlot'
import { Petal, Rose } from './Flowers'

type Props = { kind: 'done' | 'goal'; text: string; onDone: () => void }
const COLORS = ['#fb7185', '#f43f5e', '#fda4af', '#e11d48', '#fecdd3']

// Petal burst + her cartoon. Plays once, then closes itself.
export default function Celebration({ kind, text, onDone }: Props) {
  const big = kind === 'goal'
  const [petals] = useState(() =>
    Array.from({ length: big ? 40 : 20 }, (_, i) => ({
      id: i,
      dx: (Math.random() - 0.5) * (big ? 900 : 600),
      dy: (Math.random() - 0.85) * (big ? 650 : 450),
      rot: (Math.random() - 0.5) * 720,
      size: 12 + Math.random() * 14,
      color: COLORS[i % COLORS.length],
    }))
  )

  useEffect(() => {
    const t = setTimeout(onDone, big ? 3600 : 2600)
    return () => clearTimeout(t)
  }, [big, onDone])

  return (
    <div className="pointer-events-none fixed inset-0 z-20 overflow-hidden" role="status">
      {petals.map((p) => (
        <div
          key={p.id}
          className="petal-burst"
          style={{ '--dx': `${p.dx}px`, '--dy': `${p.dy}px`, '--rot': `${p.rot}deg` } as CSSProperties}
        >
          <Petal size={p.size} color={p.color} />
        </div>
      ))}

      <div className="absolute inset-x-0 top-1/3 flex justify-center">
        <div className="pop-in flex flex-col items-center gap-2 rounded-3xl bg-surface px-8 py-5 shadow-2xl">
          <CartoonSlot name={big ? 'goal' : 'done'} size={big ? 160 : 120} />
          <div className="flex items-center gap-2 font-display text-lg font-bold">
            <span className="bloom flex"><Rose size={26} /></span>
            {text}
          </div>
        </div>
      </div>
    </div>
  )
}
