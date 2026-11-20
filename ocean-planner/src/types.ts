export type Level = 'month' | 'week' | 'day'
export type Status = 'todo' | 'doing' | 'done'
export type Priority = 'low' | 'medium' | 'high'

export type Task = {
  id: string
  user_id: string
  parent_id: string | null
  title: string
  notes: string | null
  level: Level
  category: string | null
  status: Status
  priority: Priority
  due_date: string | null
  remind_at: string | null
  created_at: string
}

export type NewTask = {
  title: string
  level: Level
  due_date: string
  priority: Priority
  category?: string | null
  notes?: string | null
  parent_id?: string | null
  remind_at?: string | null
}
