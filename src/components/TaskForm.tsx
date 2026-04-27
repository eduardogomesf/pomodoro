import { useState } from 'react'
import type { Task } from '../types'

type TaskFormData = Omit<Task, 'id'>

interface Props {
  initial?: Task
  onSubmit: (data: TaskFormData) => void
  onCancel: () => void
}

export function TaskForm({ initial, onSubmit, onCancel }: Props) {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [totalCycles, setTotalCycles] = useState(initial?.totalCycles ?? 4)
  const [cycleDuration, setCycleDuration] = useState(initial?.cycleDuration ?? 25)
  const [breakDuration, setBreakDuration] = useState(initial?.breakDuration ?? 5)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
      totalCycles,
      cycleDuration,
      breakDuration,
    })
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{initial ? 'Edit Task' : 'New Task'}</h2>
        <form onSubmit={handleSubmit} className="task-form">
          <label>
            Title *
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              autoFocus
            />
          </label>
          <label>
            Description
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
            />
          </label>
          <div className="form-row">
            <label>
              Cycles
              <input
                type="number"
                min={1}
                value={totalCycles}
                onChange={e => setTotalCycles(Number(e.target.value))}
              />
            </label>
            <label>
              Cycle (min)
              <input
                type="number"
                min={1}
                value={cycleDuration}
                onChange={e => setCycleDuration(Number(e.target.value))}
              />
            </label>
            <label>
              Break (min)
              <input
                type="number"
                min={1}
                value={breakDuration}
                onChange={e => setBreakDuration(Number(e.target.value))}
              />
            </label>
          </div>
          <div className="modal-actions">
            <button type="submit" className="btn btn-primary">
              {initial ? 'Save' : 'Add Task'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
