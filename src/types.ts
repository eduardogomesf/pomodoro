export interface Task {
  id: string
  title: string
  description?: string
  totalCycles: number
  cycleDuration: number
  breakDuration: number
}

export interface TaskProgress {
  taskId: string
  cyclesCompleted: number
  status: 'pending' | 'done'
}

export interface StoredData {
  tasks: Task[]
  progress: TaskProgress[]
  lastActiveDate: string
}
