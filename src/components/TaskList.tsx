import type { Task, TaskProgress } from '../types'
import { TaskCard } from './TaskCard'

interface Props {
  tasks: Task[]
  progress: TaskProgress[]
  activeTaskId: string | null
  onSetActive: (id: string) => void
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
  onAddTask: () => void
}

export function TaskList({ tasks, progress, activeTaskId, onSetActive, onEdit, onDelete, onAddTask }: Props) {
  return (
    <section className="task-list">
      <div className="task-list__header">
        <h2>Tasks</h2>
        <button className="btn btn-primary" onClick={onAddTask}>+ Add Task</button>
      </div>
      {tasks.length === 0 ? (
        <p className="task-list__empty">No tasks yet. Add one to get started.</p>
      ) : (
        tasks.map(task => {
          const prog = progress.find(p => p.taskId === task.id) ?? {
            taskId: task.id,
            cyclesCompleted: 0,
            status: 'pending' as const,
          }
          return (
            <TaskCard
              key={task.id}
              task={task}
              progress={prog}
              isActive={activeTaskId === task.id}
              onSetActive={() => onSetActive(task.id)}
              onEdit={() => onEdit(task)}
              onDelete={() => onDelete(task.id)}
            />
          )
        })
      )}
    </section>
  )
}
