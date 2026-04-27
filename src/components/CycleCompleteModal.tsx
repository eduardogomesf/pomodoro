interface Props {
  taskTitle: string
  onDone: () => void
  onAddCycle: () => void
}

export function CycleCompleteModal({ taskTitle, onDone, onAddCycle }: Props) {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>All cycles complete!</h2>
        <p>You've finished all cycles for <strong>{taskTitle}</strong>.</p>
        <div className="modal-actions">
          <button className="btn btn-primary" onClick={onDone}>Mark as Done</button>
          <button className="btn btn-secondary" onClick={onAddCycle}>Add One More Cycle</button>
        </div>
      </div>
    </div>
  )
}
