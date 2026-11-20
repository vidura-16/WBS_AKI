export function Rose({ size = 48 }: { size?: number }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
      <g transform="translate(50 50)">
        {[0, 72, 144, 216, 288].map((a) => (
          <ellipse key={a} rx="22" ry="30" cy="-16" fill="#e11d48" transform={`rotate(${a})`} />
        ))}
        {[36, 108, 180, 252, 324].map((a) => (
          <ellipse key={a} rx="17" ry="23" cy="-11" fill="#fb7185" transform={`rotate(${a})`} />
        ))}
        <circle r="13" fill="#be123c" />
        <path
          d="M-8 0a8 8 0 0116 0a5 5 0 01-10 0a2.5 2.5 0 015 0"
          fill="none"
          stroke="#fda4af"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </g>
    </svg>
  )
}

export function Petal({ size = 16, color = '#fb7185' }: { size?: number; color?: string }) {
  return (
    <svg viewBox="0 0 24 28" width={size} height={size * 1.17} aria-hidden="true">
      <path d="M12 0C20 8 20 20 12 28C4 20 4 8 12 0Z" fill={color} />
    </svg>
  )
}
