import { useState, type FormEvent } from 'react'
import type { Assessment } from '../../types'
import { IconClose } from '../icons'

type NewAssessmentModalProps = {
  open: boolean
  nextId: string
  onClose: () => void
  onCreate: (assessment: Assessment) => void
}

export function NewAssessmentModal({ open, nextId, onClose, onCreate }: NewAssessmentModalProps) {
  const [patientName, setPatientName] = useState('')
  const [age, setAge] = useState('55')
  const [joint, setJoint] = useState<Assessment['joint']>('Left Knee')

  if (!open) return null

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const parsedAge = Number(age) || 50
    const score = Math.min(95, Math.max(12, Math.round((parsedAge - 30) * 1.4 + Math.random() * 18)))
    const risk: Assessment['risk'] = score >= 70 ? 'High' : score >= 40 ? 'Moderate' : 'Low'

    onCreate({
      id: nextId,
      patientName: patientName.trim() || 'Unnamed patient',
      age: parsedAge,
      joint,
      risk,
      score,
      date: new Date().toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    })

    setPatientName('')
    setAge('55')
    setJoint('Left Knee')
    onClose()
  }

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-assessment-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 id="new-assessment-title">New assessment</h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close">
            <IconClose />
          </button>
        </div>
        <p className="panel-sub modal-copy">
          Stores locally in this preview only. Risk score is mocked until the model is connected.
        </p>
        <form onSubmit={handleSubmit} className="form-grid">
          <label>
            Patient name
            <input
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              placeholder="e.g. Neha Verma"
              autoFocus
            />
          </label>
          <label>
            Age
            <input
              type="number"
              min={18}
              max={100}
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
          </label>
          <label>
            Joint
            <select value={joint} onChange={(e) => setJoint(e.target.value as Assessment['joint'])}>
              <option>Left Knee</option>
              <option>Right Knee</option>
              <option>Bilateral</option>
            </select>
          </label>
          <div className="modal-actions">
            <button type="button" className="btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Save preview
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
