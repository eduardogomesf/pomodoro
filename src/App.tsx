import { useState, useCallback } from 'react'
import './App.css'
import { useTasks } from './hooks/useTasks'
import { useTimer } from './hooks/useTimer'
import { Timer } from './components/Timer'
import { TaskList } from './components/TaskList'
import { TaskForm } from './components/TaskForm'
import { CycleCompleteModal } from './components/CycleCompleteModal'
import type { Task } from './types'

export default function App() {
  const {
    tasks, progress,
    addTask, updateTask, deleteTask,
    markCycleDone, addExtraCycle, markTaskDone, resetProgress,
    getProgress,
  } = useTasks()

  const [activeTaskId, setActiveTaskId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [showCycleModal, setShowCycleModal] = useState(false)

  const activeTask = tasks.find(t => t.id === activeTaskId) ?? null
  const activeProgress = activeTask ? getProgress(activeTask.id) ?? null : null

  const handleCycleComplete = useCallback(() => {
    if (!activeTaskId) return
    markCycleDone(activeTaskId)
    const prog = getProgress(activeTaskId)
    const task = tasks.find(t => t.id === activeTaskId)
    if (task && prog && prog.cyclesCompleted + 1 >= task.totalCycles) {
      setShowCycleModal(true)
    }
  }, [activeTaskId, markCycleDone, getProgress, tasks])

  const handleBreakComplete = useCallback(() => {
    // break ended — user can manually start next cycle
  }, [])

  const timer = useTimer({
    cycleDuration: activeTask?.cycleDuration ?? 25,
    breakDuration: activeTask?.breakDuration ?? 5,
    onCycleComplete: handleCycleComplete,
    onBreakComplete: handleBreakComplete,
  })

  function handleSetActive(id: string) {
    setActiveTaskId(id)
    timer.resetTime()
    setShowCycleModal(false)
  }

  function handleDelete(id: string) {
    deleteTask(id)
    if (activeTaskId === id) {
      setActiveTaskId(null)
      setShowCycleModal(false)
    }
  }

  function handleDone() {
    if (activeTaskId) markTaskDone(activeTaskId)
    setShowCycleModal(false)
  }

  function handleAddCycle() {
    if (activeTaskId) addExtraCycle(activeTaskId)
    setShowCycleModal(false)
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Pomodoro</h1>
      </header>

      <main className="app-main">
        <Timer
          task={activeTask}
          progress={activeProgress}
          status={timer.status}
          timeLeft={timer.timeLeft}
          onStart={timer.start}
          onStop={timer.stop}
          onResetTime={timer.resetTime}
          onResetCycles={() => {
            timer.resetCycles()
            if (activeTaskId) resetProgress(activeTaskId)
          }}
          onStartBreak={timer.startBreak}
        />

        <TaskList
          tasks={tasks}
          progress={progress}
          activeTaskId={activeTaskId}
          onSetActive={handleSetActive}
          onEdit={task => { setEditingTask(task); setShowForm(true) }}
          onDelete={handleDelete}
          onAddTask={() => { setEditingTask(null); setShowForm(true) }}
        />
      </main>

      {showForm && (
        <TaskForm
          initial={editingTask ?? undefined}
          onSubmit={data => {
            if (editingTask) updateTask(editingTask.id, data)
            else addTask(data)
            setShowForm(false)
            setEditingTask(null)
          }}
          onCancel={() => { setShowForm(false); setEditingTask(null) }}
        />
      )}

      {showCycleModal && activeTask && (
        <CycleCompleteModal
          taskTitle={activeTask.title}
          onDone={handleDone}
          onAddCycle={handleAddCycle}
        />
      )}
    </div>
  )
}
