import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTasks } from '../useTasks'

beforeEach(() => {
  localStorage.clear()
  vi.useFakeTimers()
  vi.setSystemTime(new Date('2026-04-27'))
})

afterEach(() => vi.useRealTimers())

describe('useTasks', () => {
  it('starts with empty tasks', () => {
    const { result } = renderHook(() => useTasks())
    expect(result.current.tasks).toEqual([])
  })

  it('adds a task and creates progress entry', () => {
    const { result } = renderHook(() => useTasks())
    act(() => {
      result.current.addTask({ title: 'Study', totalCycles: 4, cycleDuration: 25, breakDuration: 5 })
    })
    expect(result.current.tasks).toHaveLength(1)
    expect(result.current.tasks[0].title).toBe('Study')
    expect(result.current.progress).toHaveLength(1)
    expect(result.current.progress[0].cyclesCompleted).toBe(0)
    expect(result.current.progress[0].status).toBe('pending')
  })

  it('deletes a task and its progress', () => {
    const { result } = renderHook(() => useTasks())
    act(() => {
      result.current.addTask({ title: 'Study', totalCycles: 4, cycleDuration: 25, breakDuration: 5 })
    })
    const id = result.current.tasks[0].id
    act(() => result.current.deleteTask(id))
    expect(result.current.tasks).toHaveLength(0)
    expect(result.current.progress).toHaveLength(0)
  })

  it('resets progress when date changes', () => {
    const stored = {
      tasks: [{ id: '1', title: 'Study', totalCycles: 4, cycleDuration: 25, breakDuration: 5 }],
      progress: [{ taskId: '1', cyclesCompleted: 3, status: 'done' }],
      lastActiveDate: '2026-04-26',
    }
    localStorage.setItem('focus-helper-data', JSON.stringify(stored))
    const { result } = renderHook(() => useTasks())
    expect(result.current.progress[0].cyclesCompleted).toBe(0)
    expect(result.current.progress[0].status).toBe('pending')
  })

  it('does not reset progress when date is same', () => {
    const stored = {
      tasks: [{ id: '1', title: 'Study', totalCycles: 4, cycleDuration: 25, breakDuration: 5 }],
      progress: [{ taskId: '1', cyclesCompleted: 3, status: 'pending' as const }],
      lastActiveDate: '2026-04-27',
    }
    localStorage.setItem('focus-helper-data', JSON.stringify(stored))
    const { result } = renderHook(() => useTasks())
    expect(result.current.progress[0].cyclesCompleted).toBe(3)
  })

  it('markCycleDone increments cyclesCompleted', () => {
    const { result } = renderHook(() => useTasks())
    act(() => {
      result.current.addTask({ title: 'Study', totalCycles: 4, cycleDuration: 25, breakDuration: 5 })
    })
    const id = result.current.tasks[0].id
    act(() => result.current.markCycleDone(id))
    expect(result.current.progress[0].cyclesCompleted).toBe(1)
  })

  it('addExtraCycle increments task totalCycles', () => {
    const { result } = renderHook(() => useTasks())
    act(() => {
      result.current.addTask({ title: 'Study', totalCycles: 4, cycleDuration: 25, breakDuration: 5 })
    })
    const id = result.current.tasks[0].id
    act(() => result.current.addExtraCycle(id))
    expect(result.current.tasks[0].totalCycles).toBe(5)
  })

  it('markTaskDone sets status to done', () => {
    const { result } = renderHook(() => useTasks())
    act(() => {
      result.current.addTask({ title: 'Study', totalCycles: 4, cycleDuration: 25, breakDuration: 5 })
    })
    const id = result.current.tasks[0].id
    act(() => result.current.markTaskDone(id))
    expect(result.current.progress[0].status).toBe('done')
  })
})
