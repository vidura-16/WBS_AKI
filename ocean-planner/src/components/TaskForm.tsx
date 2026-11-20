import { useState, type FormEvent } from 'react'
import type { Level, NewTask, Priority, Task } from '../types'
import { LEVEL_ORDER } from '../lib/tasks'

const CATEGORIES = ['Internship', 'Thesis', 'Exams', 'Fieldwork', 'Lab work', 'Reading', 'Personal']
const field =
  'w-full rounded-lg border border-line bg-bg px-3 py-2 text-ink outline-none focus:ring-2 focus:ring-accent'

type Props = {
  tasks: Task[]
  defaultLevel: Level
  defaultDate: string
  onAdd: (t: NewTask) => Promise<void>
  onClose: () => void
}

export default function TaskForm({ tasks, defaultLevel, defaultDate, onAdd, onClose }: Props) {
  const [title, setTitle] = useState('')
  const [level, setLevel] = useState<Level>(defaultLevel)
  const [date, setDate] = useState(defaultDate)
  const [category, setCategory] = useState('')
  const [priority, setPriority] = useState<Priority>('medium')
  const [parentId, setParentId] = useState('')
  const [remind, setRemind] = useState('')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)

  // A task can sit under a higher-level task (day -> week -> month)
  const parentOptions = tasks.filter(
    (t) => LEVEL_ORDER.indexOf(t.level) < LEVEL_ORDER.indexOf(level) && t.status !== 'done'
  )
  const parent = parentOptions.some((p) => p.id === parentId) ? parentId : ''

  async function submit(e: FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    setSaving(true)
    await onAdd({
      title: title.trim(),
      level,
      due_date: date,
      priority,
      category,
      notes,
      parent_id: parent || null,
      remind_at: remind ? new Date(remind).toISOString() : null,
    })
    setSaving(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-10 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4">
      <form
        onSubmit={submit}
        className="max-h-[92vh] w-full max-w-lg space-y-3 overflow-y-auto rounded-t-2xl bg-surface p-5 shadow-xl sm:rounded-2xl"
      >
        <h2 className="font-display text-xl font-bold">New task</h2>

        <input
          autoFocus
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          className={field}
        />

        <div className="grid grid-cols-2 gap-3">
          <label className="text-sm text-muted">
            Type
            <select value={level} onChange={(e) => setLevel(e.target.value as Level)} className={field}>
              <option value="month">Month goal</option>
              <option value="week">Week goal</option>
              <option value="day">Day task</option>
            </select>
          </label>
          <label className="text-sm text-muted">
            Due date
            <input type="date" required value={date} onChange={(e) => setDate(e.target.value)} className={field} />
          </label>
          <label className="text-sm text-muted">
            Category
            <input list="cats" value={category} onChange={(e) => setCategory(e.target.value)} className={field} />
            <datalist id="cats">
              {CATEGORIES.map((c) => <option key={c} value={c} />)}
            </datalist>
          </label>
          <label className="text-sm text-muted">
            Priority
            <select value={priority} onChange={(e) => setPriority(e.target.value as Priority)} className={field}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </label>
        </div>

        {parentOptions.length > 0 && (
          <label className="block text-sm text-muted">
            Part of
            <select value={parent} onChange={(e) => setParentId(e.target.value)} className={field}>
              <option value="">Nothing (standalone)</option>
              {parentOptions.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} ({p.level})
                </option>
              ))}
            </select>
          </label>
        )}

        <label className="block text-sm text-muted">
          Remind me at (optional)
          <input type="datetime-local" value={remind} onChange={(e) => setRemind(e.target.value)} className={field} />
        </label>

        <label className="block text-sm text-muted">
          Notes (optional)
          <textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} className={field} />
        </label>

        <div className="flex justify-end gap-2 pt-1">
          <button type="button" onClick={onClose} className="rounded-lg px-4 py-2 text-muted hover:text-ink">
            Cancel
          </button>
          <button
            disabled={saving}
            className="rounded-lg bg-accent px-5 py-2 font-semibold text-accent-ink disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Add task'}
          </button>
        </div>
      </form>
    </div>
  )
}
