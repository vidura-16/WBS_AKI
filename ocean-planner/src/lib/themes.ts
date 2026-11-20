export const THEMES = [
  { id: 'ocean', label: 'Ocean', swatch: '#0891b2' },
  { id: 'lagoon', label: 'Lagoon', swatch: '#0f9d7a' },
  { id: 'coral', label: 'Coral', swatch: '#f0735a' },
  { id: 'orchid', label: 'Orchid', swatch: '#8b5cf6' },
  { id: 'deepsea', label: 'Deep sea', swatch: '#38bdf8' },
] as const

export type ThemeId = (typeof THEMES)[number]['id']
