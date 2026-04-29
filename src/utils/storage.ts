import type { StoredData } from '../types'

const KEY = 'focus-helper-data'

const DEFAULT: StoredData = {
  tasks: [],
  progress: [],
  lastActiveDate: '',
}

export function loadData(): StoredData {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as StoredData) : { ...DEFAULT }
  } catch {
    return { ...DEFAULT }
  }
}

export function saveData(data: StoredData): void {
  localStorage.setItem(KEY, JSON.stringify(data))
}
