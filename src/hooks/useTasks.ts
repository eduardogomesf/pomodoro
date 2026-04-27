import { useState, useEffect, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'
import type { Task, TaskProgress } from '../types'
import { loadData, saveData } from '../utils/storage'
import { todayISO } from '../utils/date'

type NewTask = Omit<Task, 'id'>

interface UseTasksReturn {
  tasks: Task[]
  progress: TaskProgress[]
  addTask: (t: NewTask) => void
  updateTask: (id: string, updates: Partial<NewTask>) => void
  deleteTask: (id: string) => void
  markCycleDone: (id: string) => void
  addExtraCycle: (id: string) => void
  markTaskDone: (id: string) => void
  getProgress: (id: string) => TaskProgress | undefined
}

export function useTasks(): UseTasksReturn {
  const [tasks, setTasks] = useState<Task[]>([])
  const [progress, setProgress] = useState<TaskProgress[]>([])

  useEffect(() => {
    const data = loadData()
    const today = todayISO()
    if (data.lastActiveDate !== today && data.tasks.length > 0) {
      data.progress = data.tasks.map(t => ({
        taskId: t.id,
        cyclesCompleted: 0,
        status: 'pending' as const,
      }))
      data.lastActiveDate = today
      saveData(data)
    }
    setTasks(data.tasks)
    setProgress(data.progress)
  }, [])

  const addTask = useCallback((t: NewTask) => {
    const task: Task = { ...t, id: uuidv4() }
    const prog: TaskProgress = { taskId: task.id, cyclesCompleted: 0, status: 'pending' }
    setTasks(prev => {
      const nextTasks = [...prev, task]
      setProgress(prevProg => {
        const nextProg = [...prevProg, prog]
        saveData({ tasks: nextTasks, progress: nextProg, lastActiveDate: todayISO() })
        return nextProg
      })
      return nextTasks
    })
  }, [])

  const updateTask = useCallback((id: string, updates: Partial<NewTask>) => {
    setTasks(prev => {
      const nextTasks = prev.map(t => t.id === id ? { ...t, ...updates } : t)
      setProgress(prevProg => {
        saveData({ tasks: nextTasks, progress: prevProg, lastActiveDate: todayISO() })
        return prevProg
      })
      return nextTasks
    })
  }, [])

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => {
      const nextTasks = prev.filter(t => t.id !== id)
      setProgress(prevProg => {
        const nextProg = prevProg.filter(p => p.taskId !== id)
        saveData({ tasks: nextTasks, progress: nextProg, lastActiveDate: todayISO() })
        return nextProg
      })
      return nextTasks
    })
  }, [])

  const updateProgress = useCallback((id: string, updates: Partial<TaskProgress>) => {
    setProgress(prev => {
      const nextProg = prev.map(p => p.taskId === id ? { ...p, ...updates } : p)
      setTasks(prevTasks => {
        saveData({ tasks: prevTasks, progress: nextProg, lastActiveDate: todayISO() })
        return prevTasks
      })
      return nextProg
    })
  }, [])

  const markCycleDone = useCallback((id: string) => {
    setProgress(prev => {
      const entry = prev.find(p => p.taskId === id)
      if (!entry) return prev
      const nextProg = prev.map(p =>
        p.taskId === id ? { ...p, cyclesCompleted: p.cyclesCompleted + 1 } : p
      )
      setTasks(prevTasks => {
        saveData({ tasks: prevTasks, progress: nextProg, lastActiveDate: todayISO() })
        return prevTasks
      })
      return nextProg
    })
  }, [])

  const addExtraCycle = useCallback((id: string) => {
    setTasks(prev => {
      const nextTasks = prev.map(t => t.id === id ? { ...t, totalCycles: t.totalCycles + 1 } : t)
      setProgress(prevProg => {
        saveData({ tasks: nextTasks, progress: prevProg, lastActiveDate: todayISO() })
        return prevProg
      })
      return nextTasks
    })
  }, [])

  const markTaskDone = useCallback((id: string) => {
    updateProgress(id, { status: 'done' })
  }, [updateProgress])

  const getProgress = useCallback((id: string) => progress.find(p => p.taskId === id), [progress])

  return { tasks, progress, addTask, updateTask, deleteTask, markCycleDone, addExtraCycle, markTaskDone, getProgress }
}
