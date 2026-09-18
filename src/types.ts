export type Lang = 'en' | 'hi'

// Added missing types used across the codebase
export type KneeSide = 'left' | 'right' | 'both'

export type DeviceLink = 'off' | 'connecting' | 'on'

export type PageId = 'dashboard' | 'assessments' | 'patients' | 'settings' | 'monitoring'

export type Patient = {
  id: string
  name: string
  age: number
  village?: string
  phone?: string
}

export type RiskLevel = 'Low' | 'Moderate' | 'High'

export type Assessment = {
  id: string
  patientId?: string
  patientName: string
  age: number
  knee?: KneeSide
  joint?: 'Left Knee' | 'Right Knee' | 'Bilateral'
  risk?: RiskLevel
  score?: number
  status?: string
  date: string
}

export type SensorStatus = 'connected' | 'idle' | 'disconnected'

export type SensorReading = {
  id: string
  name: string
  unit: string
  value: number
  min: number
  max: number
  status: SensorStatus
}

export type GraphPoint = {
  t: number
  value: number
}