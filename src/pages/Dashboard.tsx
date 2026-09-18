import { useState } from 'react'
import { NewAssessmentModal } from '../components/dashboard/NewAssessmentModal'
import { RecentAssessments } from '../components/dashboard/RecentAssessments'
import { LiveSensorMonitoring } from '../components/dashboard/LiveSensorMonitoring'
import { SummaryCards } from '../components/dashboard/SummaryCards'
import { Sidebar } from '../components/layout/Sidebar'
import { TopBar } from '../components/layout/TopBar'
import { useAppState } from '../state/AppState'
import { useLiveSensors } from '../hooks/useLiveSensors'
import { useLang } from '../i18n/LanguageContext'
import type { Assessment } from '../types'

export function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const { t } = useLang()
  const { assessments } = useAppState()
  const { sensors, series } = useLiveSensors()

  // Use assessments from app state instead of mock data
  // Check if we have any assessments to determine empty state
  const hasAssessments = assessments.length > 0

  return (
    <div className="app-shell">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main-column">
        <TopBar onMenu={() => setSidebarOpen(true)} onNewAssessment={() => setModalOpen(true)} />
        <main className="content">
          {/* Welcome empty state for first-time users */}
          {!hasAssessments ? (
            <section className="welcome-container">
              <h1 className="welcome-title">{t('welcomeTitle')}</h1>
              <p className="welcome-body">{t('welcomeBody')}</p>
              <div className="welcome-actions">
                <button className="btn-primary welcome-btn" onClick={() => setModalOpen(true)}>
                  <svg className="icon-plus" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 5v14M5 12h14"/>
                  </svg>
                  {t('addPatient')}
                </button>
                <button className="btn-ghost welcome-btn" onClick={() => setModalOpen(true)}>
                  <svg className="icon-activity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 12h4l2.5-6 5 12 2.5-6H21"/>
                  </svg>
                  {t('startAssessment')}
                </button>
              </div>
              <p className="welcome-note">{t('emptyNote')}</p>
            </section>
          ) : (
            /* Normal dashboard when there are assessments */
            <>
              <SummaryCards assessments={assessments} />
              <LiveSensorMonitoring sensors={sensors} series={series} />
              <RecentAssessments assessments={assessments} />
            </>
          )}
        </main>
      </div>
      <NewAssessmentModal
        open={modalOpen}
        nextId="ND-1"
        onClose={() => setModalOpen(false)}
        onCreate={(row) => {
          // Use app state for assessments instead of local state
          // This will be handled by the global AppState provider
          console.log('Assessment created:', row)
          setModalOpen(false)
        }}
      />
    </div>
  )
}
