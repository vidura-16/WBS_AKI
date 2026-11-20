import { useEffect } from 'react'
import CartoonSlot from './CartoonSlot'

// Small pop-up shown when a task is added.
export default function Toast({ text, onDone }: { text: string; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2600)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-24 z-20 flex justify-center px-4" role="status">
      <div className="pop-in flex items-center gap-3 rounded-2xl bg-surface py-2 pl-2 pr-5 shadow-xl">
        <CartoonSlot name="added" size={56} />
        <span className="font-semibold">{text}</span>
      </div>
    </div>
  )
}
