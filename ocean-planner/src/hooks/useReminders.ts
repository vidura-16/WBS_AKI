import { useEffect, useState } from 'react'
import type { Task } from '../types'

const KEY = 'notified-reminders'
const DAY = 24 * 60 * 60 * 1000

const seen = (): string[] => {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]')
  } catch {
    return []
  }
}

// Shows a browser notification when a task's reminder time arrives.
// Works while the app is open in a tab. (Closed-app push comes later.)
export function useReminders(tasks: Task[]) {
  const supported = typeof Notification !== 'undefined'
  const [permission, setPermission] = useState<NotificationPermission>(
    supported ? Notification.permission : 'denied'
  )

  async function enable() {
    if (!supported) return
    setPermission(await Notification.requestPermission())
  }

  useEffect(() => {
    if (!supported || permission !== 'granted') return

    function check() {
      const now = Date.now()
      const done = seen()
      const due = tasks.filter((t) => {
        if (!t.remind_at || t.status === 'done') return false
        const at = new Date(t.remind_at).getTime()
        return at <= now && now - at < DAY && !done.includes(`${t.id}:${t.remind_at}`)
      })
      due.forEach((t) => new Notification(`🌊 ${t.title}`, { body: t.category ?? 'Reminder' }))
      if (due.length) {
        const keys = due.map((t) => `${t.id}:${t.remind_at}`)
        localStorage.setItem(KEY, JSON.stringify([...done, ...keys].slice(-200)))
      }
    }

    check()
    const id = setInterval(check, 30_000)
    return () => clearInterval(id)
  }, [tasks, permission, supported])

  return { supported, permission, enable }
}
