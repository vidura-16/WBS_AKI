import type { Task } from '../types'
import { childrenOf, progressOf } from '../lib/tasks'
import { fmt, fromISO } from '../lib/dates'
import { Rose } from './Flowers'

type Props = {
  task: Task
  all: Task[]
  nested?: boolean
  onCycle: (t: Task) => void
  onDelete: (t: Task) => void
}

const PRIORITY = {
  low: 'bg-emerald-400',
  medium: 'bg-amber-400',
  high: 'bg-rose-500',
}

const STATUS_LABEL = { todo: 'To do', doing: 'In progress', done: 'Done' }

export default function TaskItem({ task, all, nested = false, onCycle, onDelete }: Props) {
  const pct = progressOf(task, all)
  const kids = nested ? childrenOf(task.id, all) : []
  const done = task.status === 'done'

  return (
    <li>
      <div className="group flex items-start gap-3 rounded-xl border border-line bg-surface px-3 py-2.5">
        <button
          onClick={() => onCycle(task)}
          aria-label={`${task.title}: ${STATUS_LABEL[task.status]}. Click to change.`}
          title={STATUS_LABEL[task.status]}
          className="-m-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
        >
          {done ? (
            <span className="bloom flex"><Rose size={24} /></span>
          ) : task.status === 'doing' ? (
            <span className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-accent"><span className="h-2 w-2 rounded-full bg-accent" /></span>
          ) : (
            <span className="h-6 w-6 rounded-full border-2 border-muted/50" />
          )}
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className={`h-2 w-2 shrink-0 rounded-full ${PRIORITY[task.priority]}`} title={`${task.priority} priority`} />
            <span className={`truncate font-semibold ${done ? 'text-muted line-through' : ''}`}>
              {task.title}
            </span>
          </div>

          <div className="mt-0.5 flex flex-wrap items-center gap-x-3 text-xs text-muted">
            {task.category && <span>{task.category}</span>}
            {task.level !== 'day' && <span>{task.level === 'month' ? 'Month goal' : 'Week goal'}</span>}
            {task.due_date && (
              <span>Due {fmt(fromISO(task.due_date), { day: 'numeric', month: 'short' })}</span>
            )}
            {task.remind_at && <span>⏰ {new Date(task.remind_at).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>}
          </div>

          {task.notes && <p className="mt-1 text-sm text-muted">{task.notes}</p>}

          {pct !== null && (
            <div className="mt-2 flex items-center gap-2">
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-line">
                <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${pct}%` }} />
              </div>
              <span className="w-9 text-right text-xs font-semibold text-muted">{pct}%</span>
            </div>
          )}
        </div>

        <button
          onClick={() => onDelete(task)}
          className="-my-1 -mr-2 rounded-lg px-2 py-2 text-xs text-muted transition hover:text-rose-600"
        >
          Delete
        </button>
      </div>

      {kids.length > 0 && (
        <ul className="ml-5 mt-2 space-y-2 border-l-2 border-line pl-3">
          {kids.map((k) => (
            <TaskItem key={k.id} task={k} all={all} nested onCycle={onCycle} onDelete={onDelete} />
          ))}
        </ul>
      )}
    </li>
  )
}
