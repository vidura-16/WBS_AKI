import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useTasks } from '../hooks/useTasks'
import { useSettings } from '../hooks/useSettings'
import { useReminders } from '../hooks/useReminders'
import { addDays, addMonths, fmt, startOfWeek, toISO } from '../lib/dates'
import { ancestorsOf, nextStatus, progressOf } from '../lib/tasks'
import { MESSAGES, pick } from '../lib/cartoons'
import type { NewTask, Task } from '../types'
import TaskItem from './TaskItem'
import TaskForm from './TaskForm'
import ThemePicker from './ThemePicker'
import PetalField from './PetalField'
import Celebration from './Celebration'
import Toast from './Toast'
import CartoonSlot from './CartoonSlot'

type View = 'day' | 'week' | 'month' | 'calendar'
const VIEWS: View[] = ['day', 'week', 'month', 'calendar']
const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default function Planner({ userId }: { userId: string }) {
  const { tasks, loading, addTask, cycleStatus, removeTask } = useTasks()
  const { theme, setTheme, name, setName } = useSettings(userId)
  const { supported, permission, enable } = useReminders(tasks)
  const [view, setView] = useState<View>('week')
  const [cursor, setCursor] = useState(() => new Date())
  const [showForm, setShowForm] = useState(false)
  const [fx, setFx] = useState<{ id: number; kind: 'done' | 'goal'; text: string } | null>(null)
  const [toast, setToast] = useState<{ id: number; text: string } | null>(null)

  const todayISO = toISO(new Date())
  const cursorISO = toISO(cursor)
  const monthKey = cursorISO.slice(0, 7)
  const weekStart = startOfWeek(cursor)
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))
  const monthStart = new Date(cursor.getFullYear(), cursor.getMonth(), 1)
  const calendarStart = startOfWeek(monthStart)
  const calendarDays = Array.from({ length: 42 }, (_, i) => addDays(calendarStart, i))
  const weekFrom = toISO(weekStart)
  const weekTo = toISO(addDays(weekStart, 6))

  const dueOn = (iso: string) => tasks.filter((t) => t.due_date === iso)

  function step(dir: 1 | -1) {
    setCursor((c) => (view === 'day' ? addDays(c, dir) : view === 'week' ? addDays(c, 7 * dir) : addMonths(c, dir)))
  }

  const title =
    view === 'day'
      ? fmt(cursor, { weekday: 'long', day: 'numeric', month: 'long' })
      : view === 'week'
        ? `${fmt(weekStart, { day: 'numeric', month: 'short' })} – ${fmt(addDays(weekStart, 6), { day: 'numeric', month: 'short', year: 'numeric' })}`
        : fmt(cursor, { month: 'long', year: 'numeric' })

  function handleCycle(t: Task) {
    cycleStatus(t)
    if (nextStatus(t.status) !== 'done') return
    const after = tasks.map((x) => (x.id === t.id ? { ...x, status: 'done' as const } : x))
    const goalDone = ancestorsOf(t, tasks).some((a) => progressOf(a, after) === 100)
    const kind = goalDone ? 'goal' : 'done'
    setFx({ id: Date.now(), kind, text: pick(MESSAGES[kind]) })
  }

  async function handleAdd(t: NewTask) {
    const ok = await addTask(t)
    if (ok) setToast({ id: Date.now(), text: pick(MESSAGES.added) })
  }

  function onDelete(t: Task) {
    if (confirm(`Delete "${t.title}" and everything under it?`)) removeTask(t.id)
  }

  const list = (items: Task[], nested = false) =>
    items.length === 0 ? null : (
      <ul className="space-y-2">
        {items.map((t) => (
          <TaskItem key={t.id} task={t} all={tasks} nested={nested} onCycle={handleCycle} onDelete={onDelete} />
        ))}
      </ul>
    )

  const empty = (text: string) => (
    <div className="flex items-center gap-4 rounded-xl border border-dashed border-line p-4 text-sm text-muted">
      <CartoonSlot name="empty" size={72} />
      <p>{text}</p>
    </div>
  )

  const heading = 'mb-2 mt-6 font-display text-lg font-bold'

  const monthGoals = tasks.filter((t) => t.level === 'month' && t.due_date?.startsWith(monthKey))
  const monthLoose = tasks.filter((t) => t.level !== 'month' && !t.parent_id && t.due_date?.startsWith(monthKey))
  const weekGoals = tasks.filter((t) => t.level === 'week' && t.due_date && t.due_date >= weekFrom && t.due_date <= weekTo)

  return (
    <>
    <PetalField />
    <div className="relative z-[1] mx-auto max-w-3xl px-4 pb-24 pt-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <CartoonSlot name="welcome" size={64} />
          <div>
          <h1 className="font-display text-3xl font-bold">Aki's Work Planner</h1>
          <button
            onClick={() => setName(prompt('What should we call you?', name) ?? name)}
            className="text-sm text-muted hover:text-ink"
          >
            {name ? `Hi, ${name}` : 'Add your name'}
          </button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <ThemePicker value={theme} onChange={setTheme} />
          <button onClick={() => supabase.auth.signOut()} className="text-sm text-muted hover:text-ink">
            Sign out
          </button>
        </div>
      </header>

      {supported && permission === 'default' && (
        <button
          onClick={enable}
          className="mt-4 w-full rounded-xl border border-accent bg-surface px-4 py-2 text-sm font-semibold text-accent"
        >
          Turn on reminders
        </button>
      )}

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex rounded-full bg-line p-1">
          {VIEWS.map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold capitalize ${
                view === v ? 'bg-accent text-accent-ink' : 'text-muted'
              }`}
            >
              {v}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => step(-1)} aria-label="Previous" className="rounded-lg px-3 py-1.5 hover:bg-line">‹</button>
          <button onClick={() => setCursor(new Date())} className="rounded-lg px-3 py-1.5 text-sm font-semibold hover:bg-line">Today</button>
          <button onClick={() => step(1)} aria-label="Next" className="rounded-lg px-3 py-1.5 hover:bg-line">›</button>
        </div>
      </div>

      <h2 className="mt-5 font-display text-2xl font-bold">{title}</h2>

      {loading ? (
        <p className="mt-6 text-muted">Loading your planner…</p>
      ) : view === 'day' ? (
        <div className="mt-4">
          {list(dueOn(cursorISO)) ?? empty('Nothing planned for this day. Add a task to get started.')}
        </div>
      ) : view === 'week' ? (
        <div>
          <h3 className={heading}>Goals this week</h3>
          {list(weekGoals) ?? empty('No week goals yet. Add one and attach day tasks to it.')}
          {weekDays.map((d) => {
            const iso = toISO(d)
            const items = dueOn(iso).filter((t) => t.level !== 'week')
            return (
              <section key={iso}>
                <h3 className={`${heading} ${iso === todayISO ? 'text-accent' : ''}`}>
                  {fmt(d, { weekday: 'long', day: 'numeric', month: 'short' })}
                  {iso === todayISO && ' (today)'}
                </h3>
                {list(items) ?? <p className="text-sm text-muted">Free day</p>}
              </section>
            )
          })}
        </div>
      ) : view === 'month' ? (
        <div>
          <h3 className={heading}>Goals this month</h3>
          {list(monthGoals, true) ?? empty('No month goals yet. Add one, then break it into weeks and days.')}
          {monthLoose.length > 0 && (
            <>
              <h3 className={heading}>Other tasks this month</h3>
              {list(monthLoose, true)}
            </>
          )}
        </div>
      ) : (
        <div className="mt-4">
          <div className="grid grid-cols-7 gap-1 sm:gap-2" aria-label="Calendar">
            {WEEKDAYS.map((day) => (
              <div key={day} className="py-2 text-center text-xs font-bold text-muted">{day}</div>
            ))}
            {calendarDays.map((day) => {
              const iso = toISO(day)
              const dayTasks = dueOn(iso)
              const inMonth = day.getMonth() === cursor.getMonth()
              return (
                <section
                  key={iso}
                  className={`min-h-24 rounded-xl border p-1.5 sm:min-h-32 sm:p-2 ${
                    inMonth ? 'border-line bg-surface' : 'border-line/60 bg-surface/50'
                  } ${iso === todayISO ? 'ring-2 ring-accent' : ''}`}
                  aria-label={`${fmt(day, { day: 'numeric', month: 'long' })}, ${dayTasks.length} tasks`}
                >
                  <div className={`mb-1 text-right text-xs font-bold ${
                    iso === todayISO ? 'text-accent' : inMonth ? 'text-ink' : 'text-muted/60'
                  }`}>
                    {day.getDate()}
                  </div>
                  <div className="space-y-1">
                    {dayTasks.map((task) => (
                      <div
                        key={task.id}
                        title={`${task.title} · ${task.status}`}
                        className={`truncate rounded-md border border-line bg-bg px-1.5 py-1 text-[10px] leading-tight sm:text-xs ${
                          task.status === 'done' ? 'text-muted line-through' : 'text-ink'
                        }`}
                      >
                        <span className={`mr-1 inline-block h-1.5 w-1.5 rounded-full align-middle ${
                          task.priority === 'high' ? 'bg-rose-500' : task.priority === 'medium' ? 'bg-amber-400' : 'bg-emerald-400'
                        }`} />
                        {task.title}
                      </div>
                    ))}
                  </div>
                </section>
              )
            })}
          </div>
          {tasks.some((task) => !task.due_date) && (
            <section className="mt-6">
              <h3 className={heading}>No due date</h3>
              {list(tasks.filter((task) => !task.due_date), true)}
            </section>
          )}
        </div>
      )}

      <button
        onClick={() => setShowForm(true)}
        style={{ bottom: 'calc(1.5rem + env(safe-area-inset-bottom))' }}
        className="fixed right-6 rounded-full bg-accent px-6 py-3 font-semibold text-accent-ink shadow-lg"
      >
        + Add task
      </button>

      {showForm && (
        <TaskForm
          tasks={tasks}
          defaultLevel={view === 'calendar' ? 'day' : view}
          defaultDate={cursorISO}
          onAdd={handleAdd}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>

    {fx && <Celebration key={fx.id} kind={fx.kind} text={fx.text} onDone={() => setFx(null)} />}
    {toast && <Toast key={toast.id} text={toast.text} onDone={() => setToast(null)} />}
    </>
  )
}
