import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Assessment, DeviceLink, PageId, Patient } from '../types'

type AppStateValue = {
  page: PageId
  setPage: (page: PageId) => void
  patients: Patient[]
  assessments: Assessment[]
  deviceLink: DeviceLink
  addPatient: (patient: Omit<Patient, 'id'>) => Patient
  addAssessment: (assessment: Omit<Assessment, 'id' | 'status' | 'date'>) => void
  connectSensors: () => void
  disconnectSensors: () => void
}

const AppStateContext = createContext<AppStateValue | null>(null)

function nextId(prefix: string, count: number) {
  return `${prefix}-${String(count + 1).padStart(3, '0')}`
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [page, setPage] = useState<PageId>('dashboard')
  const [patients, setPatients] = useState<Patient[]>([])
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [deviceLink, setDeviceLink] = useState<DeviceLink>('off')

  const value = useMemo<AppStateValue>(
    () => ({
      page,
      setPage,
      patients,
      assessments,
      deviceLink,
      addPatient: (patient) => {
        let saved: Patient = { ...patient, id: nextId('P', 0) }
        setPatients((prev) => {
          saved = { ...patient, id: nextId('P', prev.length) }
          return [saved, ...prev]
        })
        return saved
      },
      addAssessment: (assessment) => {
        const locale = document.documentElement.lang === 'hi' ? 'hi-IN' : 'en-IN'
        setAssessments((prev) => [
          {
            ...assessment,
            id: nextId('A', prev.length),
            status: 'waiting',
            date: new Date().toLocaleString(locale, {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            }),
          },
          ...prev,
        ])
      },
      connectSensors: () => {
        setDeviceLink('connecting')
        window.setTimeout(() => setDeviceLink('on'), 900)
      },
      disconnectSensors: () => setDeviceLink('off'),
    }),
    [page, patients, assessments, deviceLink],
  )

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
}

export function useAppState() {
  const ctx = useContext(AppStateContext)
  if (!ctx) throw new Error('useAppState must be used inside AppStateProvider')
  return ctx
}
