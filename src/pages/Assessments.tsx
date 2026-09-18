import { useLang } from '../i18n/LanguageContext'
import { useAppState } from '../state/AppState'
import { EmptyState } from '../components/shared/EmptyState'
import type { KneeSide } from '../types'
import type { MessageKey } from '../i18n/strings'

const KNEE_KEYS: Record<KneeSide, MessageKey> = {
  left: 'kneeLeft',
  right: 'kneeRight',
  both: 'kneeBoth',
}

type AssessmentsProps = {
  onStartAssessment: () => void
}

export function Assessments({ onStartAssessment }: AssessmentsProps) {
  const { t } = useLang()
  const { assessments } = useAppState()

  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <h2>{t('navAssessments')}</h2>
          <p className="panel-sub">{t('noAssessmentsHint')}</p>
        </div>
        <button type="button" className="btn-primary" onClick={onStartAssessment}>
          {t('startAssessment')}
        </button>
      </div>

      {assessments.length === 0 ? (
        <EmptyState title={t('noAssessments')} hint={t('noAssessmentsHint')} />
      ) : (
        <ul className="record-list">
          {assessments.map((row) => (
            <li key={row.id} className="record-card">
              <div>
                <strong>{row.patientName}</strong>
                <p>
                  {row.age} {t('years')} · {t(KNEE_KEYS[row.knee])}
                </p>
              </div>
              <div className="record-meta">
                <span className="chip chip-connecting">{t('waiting')}</span>
                <p className="muted">{row.date}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
