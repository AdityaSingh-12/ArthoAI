import { useAppState } from '../state/AppState'
import { useLiveSensors } from '../hooks/useLiveSensors'
import { useLang } from '../i18n/LanguageContext'
import { SummaryCards } from '../components/dashboard/SummaryCards'
import { LiveSensorMonitoring } from '../components/dashboard/LiveSensorMonitoring'
import { RecentAssessments } from '../components/dashboard/RecentAssessments'

type DashboardProps = {
  onAddPatient?: () => void
  onStartAssessment?: () => void
}

export function Dashboard({ onAddPatient, onStartAssessment }: DashboardProps) {
  const { t } = useLang()
  const { assessments } = useAppState()
  const { sensors, series } = useLiveSensors()

  const hasAssessments = assessments.length > 0

  if (!hasAssessments) {
    return (
      <section className="welcome-container">
        <h1 className="welcome-title">{t('welcomeTitle')}</h1>
        <p className="welcome-body">{t('welcomeBody')}</p>
        <div className="welcome-actions">
          <button type="button" className="btn-primary welcome-btn" onClick={onAddPatient}>
            <svg className="icon-plus" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            {t('addPatient')}
          </button>
          <button type="button" className="btn-ghost welcome-btn" onClick={onStartAssessment}>
            <svg className="icon-activity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12h4l2.5-6 5 12 2.5-6H21"/>
            </svg>
            {t('startAssessment')}
          </button>
        </div>
        <p className="welcome-note">{t('emptyNote')}</p>
      </section>
    )
  }

  return (
    <>
      <SummaryCards assessments={assessments} />
      <LiveSensorMonitoring sensors={sensors} series={series} />
      <RecentAssessments assessments={assessments} />
    </>
  )
}
