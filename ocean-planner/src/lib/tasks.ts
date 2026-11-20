import type { Level, Status, Task } from '../types'

export const LEVEL_ORDER: Level[] = ['month', 'week', 'day']

export const childrenOf = (id: string, tasks: Task[]) =>
  tasks.filter((t) => t.parent_id === id)

// The lowest-level tasks under a parent. Progress is counted from these.
export function leavesOf(id: string, tasks: Task[]): Task[] {
  return childrenOf(id, tasks).flatMap((k) => {
    const deeper = leavesOf(k.id, tasks)
    return deeper.length ? deeper : [k]
  })
}

export function progressOf(task: Task, tasks: Task[]): number | null {
  const leaves = leavesOf(task.id, tasks)
  if (!leaves.length) return null
  const done = leaves.filter((l) => l.status === 'done').length
  return Math.round((done / leaves.length) * 100)
}

export const nextStatus = (s: Status): Status =>
  s === 'todo' ? 'doing' : s === 'doing' ? 'done' : 'todo'

// All parents above a task (nearest first)
export function ancestorsOf(task: Task, tasks: Task[]): Task[] {
  const out: Task[] = []
  let cur = task
  while (cur.parent_id) {
    const p = tasks.find((t) => t.id === cur.parent_id)
    if (!p) break
    out.push(p)
    cur = p
  }
  return out
}
