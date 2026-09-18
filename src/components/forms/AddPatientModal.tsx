import { useState, type FormEvent } from 'react'
import { IconClose } from '../icons'
import { useLang } from '../../i18n/LanguageContext'
import { useAppState } from '../../state/AppState'

type AddPatientModalProps = {
  open: boolean
  onClose: () => void
}

export function AddPatientModal({ open, onClose }: AddPatientModalProps) {
  const { t } = useLang()
  const { addPatient, setPage } = useAppState()
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [village, setVillage] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')

  if (!open) return null

  function reset() {
    setName('')
    setAge('')
    setVillage('')
    setPhone('')
    setError('')
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!name.trim()) {
      setError(t('requiredName'))
      return
    }
    if (!age) {
      setError(t('requiredAge'))
      return
    }
    addPatient({
      name: name.trim(),
      age: Number(age),
      village: village.trim(),
      phone: phone.trim(),
    })
    reset()
    setPage('patients')
    onClose()
  }

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-patient-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 id="add-patient-title">{t('addPatientTitle')}</h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label={t('close')}>
            <IconClose />
          </button>
        </div>
        <p className="panel-sub modal-copy">{t('addPatientHelp')}</p>
        <form onSubmit={handleSubmit} className="form-grid">
          <label>
            {t('name')}
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder={t('namePlaceholder')} autoFocus />
          </label>
          <label>
            {t('age')}
            <input type="number" min={1} max={120} value={age} onChange={(e) => setAge(e.target.value)} />
          </label>
          <label>
            {t('village')}
            <input value={village} onChange={(e) => setVillage(e.target.value)} placeholder={t('villagePlaceholder')} />
          </label>
          <label>
            {t('phone')}
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={t('phonePlaceholder')} inputMode="tel" />
          </label>
          {error ? <p className="form-error">{error}</p> : null}
          <div className="modal-actions">
            <button type="button" className="btn-ghost" onClick={onClose}>
              {t('cancel')}
            </button>
            <button type="submit" className="btn-primary">
              {t('save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
