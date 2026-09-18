import { useLang } from '../i18n/LanguageContext'
import { useAppState } from '../state/AppState'
import { EmptyState } from '../components/shared/EmptyState'

type PatientsProps = {
  onAddPatient: () => void
}

export function Patients({ onAddPatient }: PatientsProps) {
  const { t } = useLang()
  const { patients } = useAppState()

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
            <li key={person.id} className="record-card">
              <div>
                <strong>{person.name}</strong>
                <p>
                  {person.age} {t('years')}
                  {person.village ? ` · ${person.village}` : ''}
                </p>
              </div>
              {person.phone ? <p className="muted">{person.phone}</p> : null}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
