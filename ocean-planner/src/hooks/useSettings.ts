import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { ThemeId } from '../lib/themes'

export function useSettings(userId: string) {
  const [theme, setThemeState] = useState<ThemeId>(
    () => (localStorage.getItem('theme') as ThemeId) || 'ocean'
  )
  const [name, setNameState] = useState('')

  // Apply theme to the whole page
  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  // Load saved settings
  useEffect(() => {
    supabase
      .from('user_settings')
      .select('theme, display_name')
      .eq('user_id', userId)
      .maybeSingle()
      .then(({ data }) => {
        if (!data) return
        setThemeState(data.theme as ThemeId)
        setNameState(data.display_name ?? '')
        localStorage.setItem('theme', data.theme)
      })
  }, [userId])

  async function save(next: { theme: ThemeId; name: string }) {
    const { error } = await supabase.from('user_settings').upsert({
      user_id: userId,
      theme: next.theme,
      display_name: next.name || null,
    })
    if (error) console.error(error)
  }

  function setTheme(t: ThemeId) {
    setThemeState(t)
    localStorage.setItem('theme', t)
    save({ theme: t, name })
  }

  function setName(n: string) {
    setNameState(n)
    save({ theme, name: n })
  }

  return { theme, setTheme, name, setName }
}
