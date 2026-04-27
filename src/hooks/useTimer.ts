import { useState, useEffect, useRef, useCallback } from 'react'
import { playCycleEndSound, playBreakEndSound } from '../utils/audio'

export type TimerStatus = 'idle' | 'running' | 'paused' | 'break'

interface UseTimerOptions {
  cycleDuration: number
  breakDuration: number
  onCycleComplete: () => void
  onBreakComplete: () => void
}

interface UseTimerReturn {
  status: TimerStatus
  timeLeft: number
  start: () => void
  stop: () => void
  resetTime: () => void
  resetCycles: () => void
  startBreak: () => void
}

export function useTimer({
  cycleDuration,
  breakDuration,
  onCycleComplete,
  onBreakComplete,
}: UseTimerOptions): UseTimerReturn {
  const [status, setStatus] = useState<TimerStatus>('idle')
  const [timeLeft, setTimeLeft] = useState(Math.round(cycleDuration * 60))
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const onCycleCompleteRef = useRef(onCycleComplete)
  const onBreakCompleteRef = useRef(onBreakComplete)

  useEffect(() => { onCycleCompleteRef.current = onCycleComplete }, [onCycleComplete])
  useEffect(() => { onBreakCompleteRef.current = onBreakComplete }, [onBreakComplete])

  useEffect(() => {
    setTimeLeft(Math.round(cycleDuration * 60))
    setStatus('idle')
  }, [cycleDuration])

  useEffect(() => {
    if (status !== 'running' && status !== 'break') {
      if (intervalRef.current) clearInterval(intervalRef.current)
      return
    }
    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!)
          if (status === 'running') {
            setStatus('idle')
            playCycleEndSound()
            onCycleCompleteRef.current()
          } else {
            setStatus('idle')
            playBreakEndSound()
            onBreakCompleteRef.current()
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [status])

  const start = useCallback(() => setStatus('running'), [])
  const stop = useCallback(() => setStatus('paused'), [])

  const resetTime = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    setStatus('idle')
    setTimeLeft(Math.round(cycleDuration * 60))
  }, [cycleDuration])

  const resetCycles = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    setStatus('idle')
    setTimeLeft(Math.round(cycleDuration * 60))
  }, [cycleDuration])

  const startBreak = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    setTimeLeft(Math.round(breakDuration * 60))
    setStatus('break')
  }, [breakDuration])

  return { status, timeLeft, start, stop, resetTime, resetCycles, startBreak }
}
