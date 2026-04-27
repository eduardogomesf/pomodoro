import type { Task, TaskProgress } from '../types'

interface Props {
  task: Task
  progress: TaskProgress
  isActive: boolean
  onSetActive: () => void
  onEdit: () => void
  onDelete: () => void
}

export function TaskCard({ task, progress, isActive, onSetActive, onEdit, onDelete }: Props) {
  return (
    <div className={`task-card ${isActive ? 'task-card--active' : ''} ${progress.status === 'done' ? 'task-card--done' : ''}`}>
      <div className="task-card__info">
        <div className="task-card__title">{task.title}</div>
        {task.description && (
          <div className="task-card__desc">{task.description}</div>
        )}
        <div className="task-card__meta">
          <span className="task-card__progress">
            {progress.cyclesCompleted}/{task.totalCycles} cycles
          </span>
          <span className={`task-card__badge task-card__badge--${progress.status}`}>
            {progress.status}
          </span>
        </div>
      </div>
      <div className="task-card__actions">
        <button
          className={`btn ${isActive ? 'btn-active' : 'btn-secondary'}`}
          onClick={onSetActive}
          disabled={progress.status === 'done'}
        >
          {isActive ? 'Active' : 'Set Active'}
        </button>
        <button className="btn btn-ghost" onClick={onEdit}>Edit</button>
        <button className="btn btn-danger" onClick={onDelete}>Delete</button>
      </div>
    </div>
  )
}
