import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTimer } from '../useTimer'

vi.mock('../../utils/audio', () => ({
  playCycleEndSound: vi.fn(),
  playBreakEndSound: vi.fn(),
}))

beforeEach(() => vi.useFakeTimers())
afterEach(() => vi.useRealTimers())

describe('useTimer', () => {
  it('initialises to idle with correct timeLeft', () => {
    const { result } = renderHook(() =>
      useTimer({ cycleDuration: 25, breakDuration: 5, onCycleComplete: vi.fn(), onBreakComplete: vi.fn() })
    )
    expect(result.current.status).toBe('idle')
    expect(result.current.timeLeft).toBe(25 * 60)
  })

  it('transitions to running on start()', () => {
    const { result } = renderHook(() =>
      useTimer({ cycleDuration: 25, breakDuration: 5, onCycleComplete: vi.fn(), onBreakComplete: vi.fn() })
    )
    act(() => result.current.start())
    expect(result.current.status).toBe('running')
  })

  it('decrements timeLeft each second', () => {
    const { result } = renderHook(() =>
      useTimer({ cycleDuration: 25, breakDuration: 5, onCycleComplete: vi.fn(), onBreakComplete: vi.fn() })
    )
    act(() => result.current.start())
    act(() => vi.advanceTimersByTime(3000))
    expect(result.current.timeLeft).toBe(25 * 60 - 3)
  })

  it('pauses on stop()', () => {
    const { result } = renderHook(() =>
      useTimer({ cycleDuration: 25, breakDuration: 5, onCycleComplete: vi.fn(), onBreakComplete: vi.fn() })
    )
    act(() => result.current.start())
    act(() => vi.advanceTimersByTime(2000))
    act(() => result.current.stop())
    expect(result.current.status).toBe('paused')
    act(() => vi.advanceTimersByTime(3000))
    expect(result.current.timeLeft).toBe(25 * 60 - 2)
  })

  it('calls onCycleComplete when countdown reaches 0', () => {
    const onCycleComplete = vi.fn()
    const { result } = renderHook(() =>
      useTimer({ cycleDuration: 1/60, breakDuration: 5, onCycleComplete, onBreakComplete: vi.fn() })
    )
    act(() => result.current.start())
    act(() => vi.advanceTimersByTime(1100))
    expect(onCycleComplete).toHaveBeenCalledTimes(1)
  })

  it('resetTime restores timeLeft without changing status', () => {
    const { result } = renderHook(() =>
      useTimer({ cycleDuration: 25, breakDuration: 5, onCycleComplete: vi.fn(), onBreakComplete: vi.fn() })
    )
    act(() => result.current.start())
    act(() => vi.advanceTimersByTime(5000))
    act(() => result.current.resetTime())
    expect(result.current.timeLeft).toBe(25 * 60)
    expect(result.current.status).toBe('idle')
  })

  it('startBreak sets status to break and resets to breakDuration', () => {
    const { result } = renderHook(() =>
      useTimer({ cycleDuration: 25, breakDuration: 5, onCycleComplete: vi.fn(), onBreakComplete: vi.fn() })
    )
    act(() => result.current.startBreak())
    expect(result.current.status).toBe('break')
    expect(result.current.timeLeft).toBe(5 * 60)
  })

  it('calls onBreakComplete when break countdown reaches 0', () => {
    const onBreakComplete = vi.fn()
    const { result } = renderHook(() =>
      useTimer({ cycleDuration: 25, breakDuration: 1/60, onCycleComplete: vi.fn(), onBreakComplete })
    )
    act(() => result.current.startBreak())
    act(() => vi.advanceTimersByTime(1100))
    expect(onBreakComplete).toHaveBeenCalledTimes(1)
  })
})
