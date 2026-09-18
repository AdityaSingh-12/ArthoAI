import { useState, type FormEvent } from 'react'
import { IconClose } from '../icons'
import { useLang } from '../../i18n/LanguageContext'
import { useAppState } from '../../state/AppState'
import type { KneeSide } from '../../types'

type StartAssessmentModalProps = {
  open: boolean
  onClose: () => void
  onAddPatient: () => void
}

export function StartAssessmentModal({ open, onClose, onAddPatient }: StartAssessmentModalProps) {
  const { t } = useLang()
  const { patients, addAssessment, setPage } = useAppState()
  const [patientId, setPatientId] = useState('')
  const [knee, setKnee] = useState<KneeSide>('left')

  if (!open) return null

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const person = patients.find((p) => p.id === patientId)
    if (!person) return
    addAssessment({
      patientId: person.id,
      patientName: person.name,
      age: person.age,
      knee,
    })
    setPatientId('')
    setKnee('left')
    setPage('assessments')
    onClose()
  }

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="start-assessment-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 id="start-assessment-title">{t('startAssessmentTitle')}</h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label={t('close')}>
            <IconClose />
          </button>
        </div>
        <p className="panel-sub modal-copy">{patients.length === 0 ? t('needPatient') : t('startAssessmentHelp')}</p>

        {patients.length === 0 ? (
          <div className="modal-actions">
            <button type="button" className="btn-ghost" onClick={onClose}>
              {t('close')}
            </button>
            <button type="button" className="btn-primary" onClick={onAddPatient}>
              {t('addPatient')}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="form-grid">
            <label>
              {t('selectPatient')}
              <select value={patientId} onChange={(e) => setPatientId(e.target.value)} required>
                <option value="">{t('choosePatient')}</option>
                {patients.map((person) => (
                  <option key={person.id} value={person.id}>
                    {person.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              {t('whichKnee')}
              <select value={knee} onChange={(e) => setKnee(e.target.value as KneeSide)}>
                <option value="left">{t('kneeLeft')}</option>
                <option value="right">{t('kneeRight')}</option>
                <option value="both">{t('kneeBoth')}</option>
              </select>
            </label>
            <div className="modal-actions">
              <button type="button" className="btn-ghost" onClick={onClose}>
                {t('cancel')}
              </button>
              <button type="submit" className="btn-primary" disabled={!patientId}>
                {t('saveAssessment')}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
