import { useState } from 'react'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'
import { Dashboard } from '../../pages/Dashboard'
import { Assessments } from '../../pages/Assessments'
import { Patients } from '../../pages/Patients'
import { Settings } from '../../pages/Settings'
import { LiveMonitoring } from '../../pages/LiveMonitoring'
import { AddPatientModal } from '../forms/AddPatientModal'
import { StartAssessmentModal } from '../forms/StartAssessmentModal'
import { useAppState } from '../../state/AppState'

export function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [patientOpen, setPatientOpen] = useState(false)
  const [assessmentOpen, setAssessmentOpen] = useState(false)
  const { page } = useAppState()

  function openAssessment() {
    setAssessmentOpen(true)
  }

  return (
    <div className="app-shell">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main-column">
        <TopBar onMenu={() => setSidebarOpen(true)} onNewAssessment={() => setPatientOpen(true)} />
        <main className="content">
          {page === 'dashboard' && (
            <Dashboard
              onAddPatient={() => setPatientOpen(true)}
              onStartAssessment={openAssessment}
            />
          )}
          {page === 'assessments' && <Assessments onStartAssessment={openAssessment} />}
          {page === 'patients' && <Patients onAddPatient={() => setPatientOpen(true)} />}
          {page === 'monitoring' && <LiveMonitoring />}
          {page === 'settings' && <Settings />}
        </main>
      </div>
      <AddPatientModal open={patientOpen} onClose={() => setPatientOpen(false)} />
      <StartAssessmentModal
        open={assessmentOpen}
        onClose={() => setAssessmentOpen(false)}
        onAddPatient={() => {
          setAssessmentOpen(false)
          setPatientOpen(true)
        }}
      />
    </div>
  )
}
