import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { nextStatus } from '../lib/tasks'
import type { NewTask, Task } from '../types'

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: true })
    if (error) console.error(error)
    else setTasks((data ?? []) as Task[])
    setLoading(false)
  }, [])

  useEffect(() => {
    void Promise.resolve().then(load)
  }, [load])

  async function addTask(t: NewTask) {
    const { error } = await supabase.from('tasks').insert({
      ...t,
      notes: t.notes || null,
      category: t.category || null,
      parent_id: t.parent_id || null,
      remind_at: t.remind_at || null,
    })
    if (error) {
      alert(error.message)
      return false
    }
    await load()
    return true
  }

  async function cycleStatus(t: Task) {
    const status = nextStatus(t.status)
    setTasks((prev) => prev.map((x) => (x.id === t.id ? { ...x, status } : x)))
    const { error } = await supabase.from('tasks').update({ status }).eq('id', t.id)
    if (error) {
      console.error(error)
      load()
    }
  }

  async function removeTask(id: string) {
    const { error } = await supabase.from('tasks').delete().eq('id', id)
    if (error) alert(error.message)
    else load()
  }

  return { tasks, loading, addTask, cycleStatus, removeTask }
}
