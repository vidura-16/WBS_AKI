import { THEMES, type ThemeId } from '../lib/themes'

type Props = { value: ThemeId; onChange: (t: ThemeId) => void }

export default function ThemePicker({ value, onChange }: Props) {
  return (
    <div className="flex items-center gap-2" role="radiogroup" aria-label="Theme">
      {THEMES.map((t) => (
        <button
          key={t.id}
          role="radio"
          aria-checked={value === t.id}
          aria-label={t.label}
          title={t.label}
          onClick={() => onChange(t.id)}
          style={{ background: t.swatch }}
          className={`h-6 w-6 rounded-full border-2 border-surface transition ${
            value === t.id ? 'ring-2 ring-ink scale-110' : 'ring-1 ring-line'
          }`}
        />
      ))}
    </div>
  )
}
