import { describe, it, expect, beforeEach } from 'vitest'
import { loadData, saveData } from '../storage'
import type { StoredData } from '../../types'

beforeEach(() => localStorage.clear())

describe('loadData', () => {
  it('returns default when localStorage is empty', () => {
    const data = loadData()
    expect(data.tasks).toEqual([])
    expect(data.progress).toEqual([])
    expect(data.lastActiveDate).toBe('')
  })

  it('returns parsed data when key exists', () => {
    const stored: StoredData = {
      tasks: [{ id: '1', title: 'Test', totalCycles: 4, cycleDuration: 25, breakDuration: 5 }],
      progress: [{ taskId: '1', cyclesCompleted: 2, status: 'pending' }],
      lastActiveDate: '2026-04-27',
    }
    localStorage.setItem('focus-helper-data', JSON.stringify(stored))
    expect(loadData()).toEqual(stored)
  })
})

describe('saveData', () => {
  it('persists data to localStorage', () => {
    const data: StoredData = { tasks: [], progress: [], lastActiveDate: '2026-04-27' }
    saveData(data)
    expect(localStorage.getItem('focus-helper-data')).toBe(JSON.stringify(data))
  })
})
