import { useState } from 'react'
import { CARTOONS, type CartoonKey } from '../lib/cartoons'
import { Rose } from './Flowers'

type Props = { name: CartoonKey; size?: number; className?: string }

// Shows her cartoon from /public/cartoons, or a rose placeholder until the file exists.
export default function CartoonSlot({ name, size = 96, className = '' }: Props) {
  const [missing, setMissing] = useState(false)
  const c = CARTOONS[name]

  if (missing) {
    return (
      <div
        style={{ width: size, height: size }}
        title={`Add public/cartoons/${c.file}`}
        className={`flex shrink-0 flex-col items-center justify-center gap-0.5 rounded-full border-2 border-dashed border-accent/50 bg-surface/70 text-[10px] text-muted ${className}`}
      >
        <Rose size={size * 0.42} />
        {size >= 64 && <span>{c.label}</span>}
      </div>
    )
  }

  return (
    <img
      src={`/cartoons/${c.file}`}
      alt={c.alt}
      onError={() => setMissing(true)}
      style={{ width: size, height: size }}
      className={`shrink-0 object-contain ${className}`}
    />
  )
}
