
import { useCallback, useEffect, useState } from 'react'
import type { GraphPoint, SensorReading } from '../types'

const API_URL = 'http://localhost:3001/api/sensor'
const POLL_MS = 700
const GRAPH_WINDOW = 50

type BackendReading = {
  fsr: number
  pressureDetected: boolean
  ax: number
  ay: number
  az: number
  gx: number
  gy: number
  gz: number
  receivedAt?: string
}

export type MonitoringSensors = {
  gait: SensorReading[]
  joint: SensorReading[]
  force: SensorReading[]
}

function makeSensor(
  id: string,
  name: string,
  unit: string,
  min: number,
  max: number,
): SensorReading {
  return { id, name, unit, value: 0, min, max, status: 'disconnected' }
}

function makeSeries(value: number): GraphPoint[] {
  return [{ t: 0, value }]
}

function appendPoint(
  previous: GraphPoint[],
  value: number,
): GraphPoint[] {
  const nextT = (previous[previous.length - 1]?.t ?? -1) + 1
  return [...previous, { t: nextT, value }].slice(-GRAPH_WINDOW)
}

export function useMonitoringSensors() {
  const [running, setRunning] = useState(false)
  const [reading, setReading] = useState<BackendReading | null>(null)
  const [connected, setConnected] = useState(false)

  const [flexLeftSeries, setFlexLeftSeries] = useState<GraphPoint[]>([])
  const [flexRightSeries, setFlexRightSeries] = useState<GraphPoint[]>([])
  const [forceSeries, setForceSeries] = useState<GraphPoint[]>([])

  const start = useCallback(() => {
    setReading(null)
    setConnected(false)
    setFlexLeftSeries([])
    setFlexRightSeries([])
    setForceSeries([])
    setRunning(true)
  }, [])

  const stop = useCallback(() => {
    setRunning(false)
    setConnected(false)
    setReading(null)
  }, [])

  useEffect(() => {
    if (!running) return

    let cancelled = false

    const fetchReading = async () => {
      try {
        const response = await fetch(API_URL, { cache: 'no-store' })
        if (!response.ok) throw new Error(`HTTP ${response.status}`)

        const data: unknown = await response.json()

        if (
          !data ||
          typeof data !== 'object' ||
          !('fsr' in data) ||
          typeof data.fsr !== 'number' ||
          !('ax' in data) ||
          typeof data.ax !== 'number' ||
          !('ay' in data) ||
          typeof data.ay !== 'number' ||
          !('az' in data) ||
          typeof data.az !== 'number' ||
          !('gx' in data) ||
          typeof data.gx !== 'number' ||
          !('gy' in data) ||
          typeof data.gy !== 'number' ||
          !('gz' in data) ||
          typeof data.gz !== 'number' ||
          !('pressureDetected' in data) ||
          typeof data.pressureDetected !== 'boolean'
        ) {
          throw new Error('No valid sensor data received yet')
        }

        const next = data as BackendReading
        if (cancelled) return

        setReading(next)
        setConnected(true)

        setFlexLeftSeries((prev) => appendPoint(prev, next.ax))
        setFlexRightSeries((prev) => appendPoint(prev, next.ay))
        setForceSeries((prev) => appendPoint(prev, next.fsr))
      } catch (error) {
        if (cancelled) return
        setConnected(false)
        console.error('Could not fetch sensor data:', error)
      }
    }

    void fetchReading()
    const timer = window.setInterval(() => {
      void fetchReading()
    }, POLL_MS)

    return () => {
      cancelled = true
      window.clearInterval(timer)
    }
  }, [running])

  const status = connected && reading ? 'connected' : 'disconnected'

  const gait: SensorReading[] = [
    {
      ...makeSensor('fsr', 'FSR ADC Reading', 'ADC', -32768, 32767),
      value: reading?.fsr ?? 0,
      status,
    },
    {
      ...makeSensor('pressure', 'Pressure Detected', '', 0, 1),
      value: reading ? Number(reading.pressureDetected) : 0,
      status,
    },
    {
      ...makeSensor('accel-x', 'Acceleration X', 'g', -2, 2),
      value: reading?.ax ?? 0,
      status,
    },
  ]

  const joint: SensorReading[] = [
    {
      ...makeSensor('accel-y', 'Acceleration Y', 'g', -2, 2),
      value: reading?.ay ?? 0,
      status,
    },
    {
      ...makeSensor('accel-z', 'Acceleration Z', 'g', -2, 2),
      value: reading?.az ?? 0,
      status,
    },
  ]

  const force: SensorReading[] = [
    {
      ...makeSensor('gyro-x', 'Gyroscope X', '°/s', -250, 250),
      value: reading?.gx ?? 0,
      status,
    },
    {
      ...makeSensor('gyro-y', 'Gyroscope Y', '°/s', -250, 250),
      value: reading?.gy ?? 0,
      status,
    },
    {
      ...makeSensor('gyro-z', 'Gyroscope Z', '°/s', -250, 250),
      value: reading?.gz ?? 0,
      status,
    },
  ]

  const allSensors = [...gait, ...joint, ...force]
  const connectedCount = allSensors.filter(
    (sensor) => sensor.status === 'connected',
  ).length

  return {
    running,
    start,
    stop,
    sensors: { gait, joint, force },
    connectedCount,
    totalCount: allSensors.length,
    graphs: { flexLeftSeries, flexRightSeries, forceSeries },
  }
}
