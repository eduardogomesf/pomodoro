# Pomodoro App — Design Spec

**Date:** 2026-04-27  
**Stack:** Vite + React + TypeScript  
**State:** Custom hooks + localStorage (no external state library)

---

## Overview

A simple single-page Pomodoro app where users manage a list of recurring tasks. Each task has configurable cycle duration, break duration, and a target number of cycles. The user picks a task, runs the timer, and progresses through cycles. Task definitions persist permanently; daily progress resets each morning.

---

## Layout

Single-page stacked layout:
- **Top:** Timer panel (active task name, countdown clock, cycle counter, controls)
- **Bottom:** Task list (all tasks, add/edit/delete, set active)

---

## Data Model

```ts
interface Task {
  id: string
  title: string
  description?: string
  totalCycles: number       // configured target cycles per day
  cycleDuration: number     // minutes per work cycle
  breakDuration: number     // minutes per break
}

interface TaskProgress {
  taskId: string
  cyclesCompleted: number
  status: 'pending' | 'done'
}

interface StoredData {
  tasks: Task[]
  progress: TaskProgress[]
  lastActiveDate: string    // ISO date "YYYY-MM-DD"
}
```

---

## Persistence & Daily Reset

- All data is stored in `localStorage` under a single key.
- On app load, `useTasks` reads `lastActiveDate` from storage.
- If today's date differs, all `TaskProgress` entries reset to `{ cyclesCompleted: 0, status: 'pending' }` and `lastActiveDate` is updated to today.
- Task definitions (`Task[]`) are never reset — they persist until explicitly deleted.

---

## Architecture

```
src/
  types.ts
  hooks/
    useTasks.ts       # Task CRUD, localStorage sync, daily reset
    useTimer.ts       # Countdown logic, start/stop/reset/break
  components/
    Timer.tsx             # Clock display + controls
    TaskForm.tsx          # Add/edit modal
    TaskList.tsx          # List container + Add button
    TaskCard.tsx          # Single task row
    CycleCompleteModal.tsx
  App.tsx
```

### useTasks

Responsibilities:
- Load tasks and progress from localStorage on mount
- Run daily reset check on mount
- CRUD: `addTask`, `updateTask`, `deleteTask` (also removes its progress entry)
- `setActiveTaskId`, `markCycleDone(taskId)`, `addExtraCycle(taskId)`, `markTaskDone(taskId)`
- Sync to localStorage on every change

### useTimer

Responsibilities:
- Countdown interval (1-second tick)
- `status`: `'idle' | 'running' | 'paused' | 'break'`
- `timeLeft`: seconds remaining
- Actions: `start()`, `stop()`, `resetTime()`, `resetCycles()`, `startBreak()`
- Fires `onCycleComplete` callback when work countdown reaches 0
- Fires `onBreakComplete` callback when break countdown reaches 0
- Plays audio notification on both events

---

## Timer Flow

1. User selects a task via **Set Active** → timer resets to that task's `cycleDuration`.
2. **Start** → countdown runs. **Stop** → pauses.
3. Cycle ends (time = 0):
   - Audio notification plays.
   - If cycles remaining > 0: "Start Break" button appears.
   - If this was the last cycle: `CycleCompleteModal` opens.
4. **Start Break** (manual) → break countdown starts from `breakDuration`.
5. Break ends → audio notification plays, user can start the next cycle.
6. `CycleCompleteModal` offers: **Mark as Done** or **Add One More Cycle**.
   - "Add One More Cycle" increments `totalCycles` for that day's progress by 1.

---

## Controls

| Control | Behaviour |
|---|---|
| Start / Stop | Toggles the countdown |
| Reset Time | Restarts current cycle countdown; cycle count unchanged |
| Reset Cycles | Resets `cyclesCompleted` to 0; returns timer to idle |
| Start Break | Manually begins the break after a cycle completes |
| Set Active | Makes a task the current active task |
| Add Task | Opens `TaskForm` modal in create mode |
| Edit Task | Opens `TaskForm` modal pre-filled |
| Delete Task | Removes task + its progress; if it was active, clears active task |

---

## Components

### Timer
- Shows: active task title (or placeholder if none selected), countdown clock, `Cycle X of Y`, status badge.
- Buttons: Start/Stop, Reset Time, Reset Cycles.
- After cycle ends: shows "Start Break" button.
- If no task is active: shows a prompt to select one.

### TaskForm (modal)
Fields:
- Title (required, text)
- Description (optional, textarea)
- Number of cycles (number, min 1)
- Cycle duration in minutes (number, min 1)
- Break duration in minutes (number, min 1)

### TaskCard
- Shows: title, description excerpt, progress (`cyclesCompleted / totalCycles`), status badge.
- Buttons: Set Active (highlighted if currently active), Edit, Delete.

### TaskList
- Renders all `TaskCard`s.
- "Add Task" button at the bottom opens `TaskForm`.

### CycleCompleteModal
- Triggered when the last configured cycle completes.
- Message: "You've completed all cycles for [task title]!"
- Buttons: **Mark as Done**, **Add One More Cycle**.

---

## Audio Notifications

- A short beep plays when a work cycle countdown reaches 0.
- A different (softer) tone plays when a break countdown reaches 0.
- Implemented with the Web Audio API (`AudioContext`) — no external audio files needed.

---

## Out of Scope

- User accounts / cloud sync
- Multiple simultaneous timers
- Statistics / history beyond today's progress
- Drag-and-drop reordering
- Dark/light theme toggle
