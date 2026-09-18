import { useLang } from '../i18n/LanguageContext'
import { useAppState } from '../state/AppState'
import { EmptyState } from '../components/shared/EmptyState'

type PatientsProps = {
  onAddPatient: () => void
}

export function Patients({ onAddPatient }: PatientsProps) {
  const { t } = useLang()
  const { patients, setSelectedPatient, setPage } = useAppState()

  const handleStartMonitoring = (person: (typeof patients)[0]) => {
    setSelectedPatient(person)
    setPage('monitoring')
  }

  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <h2>{t('navPatients')}</h2>
          <p className="panel-sub">{t('noPatientsHint')}</p>
        </div>
        <button type="button" className="btn-primary" onClick={onAddPatient}>
          {t('addPatient')}
        </button>
      </div>

      {patients.length === 0 ? (
        <EmptyState title={t('noPatients')} hint={t('noPatientsHint')} />
      ) : (
        <ul className="record-list">
          {patients.map((person) => (
            <li key={person.id} className="record-card patient-card-item">
              <div>
                <strong>{person.name}</strong>
                <p>
                  {person.age} {t('years')}
                  {person.village ? ` · ${person.village}` : ''}
                </p>
                {person.phone ? <p className="muted">{person.phone}</p> : null}
              </div>
              <button
                type="button"
                className="btn-primary btn-sm"
                onClick={() => handleStartMonitoring(person)}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                Live Monitoring
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
