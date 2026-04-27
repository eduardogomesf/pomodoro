import type { TimerStatus } from '../hooks/useTimer'
import type { Task, TaskProgress } from '../types'

interface Props {
  task: Task | null
  progress: TaskProgress | null
  status: TimerStatus
  timeLeft: number
  onStart: () => void
  onStop: () => void
  onResetTime: () => void
  onResetCycles: () => void
  onStartBreak: () => void
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

export function Timer({
  task,
  progress,
  status,
  timeLeft,
  onStart,
  onStop,
  onResetTime,
  onResetCycles,
  onStartBreak,
}: Props) {
  const cyclesDone = progress?.cyclesCompleted ?? 0
  const totalCycles = task?.totalCycles ?? 0
  const cycleLabel = task ? `Cycle ${cyclesDone + 1} of ${totalCycles}` : '—'

  const statusLabel: Record<TimerStatus, string> = {
    idle: 'Ready',
    running: 'Focusing',
    paused: 'Paused',
    break: 'Break',
  }

  const cycleJustFinished = status === 'idle' && timeLeft === 0

  return (
    <section className="timer">
      <div className="timer__task-name">
        {task ? task.title : 'Select a task to start'}
      </div>
      <div className={`timer__clock timer__clock--${status}`}>
        {formatTime(timeLeft)}
      </div>
      <div className="timer__meta">
        <span className="timer__cycle-label">{cycleLabel}</span>
        <span className={`timer__status timer__status--${status}`}>{statusLabel[status]}</span>
      </div>
      <div className="timer__controls">
        {!task ? null : status === 'running' ? (
          <button className="btn btn-primary" onClick={onStop}>Stop</button>
        ) : status === 'break' ? (
          <button className="btn btn-secondary" disabled>Break running…</button>
        ) : cycleJustFinished ? (
          <button className="btn btn-primary" onClick={onStartBreak}>Start Break</button>
        ) : (
          <button className="btn btn-primary" onClick={onStart}>Start</button>
        )}
        <button className="btn btn-ghost" onClick={onResetTime} disabled={!task}>Reset Time</button>
        <button className="btn btn-ghost" onClick={onResetCycles} disabled={!task}>Reset Cycles</button>
      </div>
    </section>
  )
}
