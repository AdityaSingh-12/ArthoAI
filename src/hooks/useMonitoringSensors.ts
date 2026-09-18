import { useCallback, useEffect, useRef, useState } from 'react'
import type { GraphPoint, SensorReading } from '../types'

/**
 * Monitoring-specific sensor data: 8 sensors arranged in logical groups,
 * plus multiple graph series. Designed so real hardware can replace the
 * mock `tick()` function later.
 */

const GRAPH_WINDOW = 50
const TICK_MS = 700

export type MonitoringSensors = {
  gait: SensorReading[]
  joint: SensorReading[]
  force: SensorReading[]
}

const initialGait: SensorReading[] = [
  { id: 'step-count', name: 'Step Count', unit: 'steps', value: 0, min: 0, max: 10000, status: 'disconnected' },
  { id: 'cadence', name: 'Gait Cadence', unit: 'spm', value: 0, min: 60, max: 160, status: 'disconnected' },
  { id: 'stride-len', name: 'Stride Length', unit: 'cm', value: 0, min: 40, max: 120, status: 'disconnected' },
]

const initialJoint: SensorReading[] = [
  { id: 'flex-l', name: 'Left Knee Flexion', unit: '°', value: 0, min: 0, max: 140, status: 'disconnected' },
  { id: 'flex-r', name: 'Right Knee Flexion', unit: '°', value: 0, min: 0, max: 140, status: 'disconnected' },
]

const initialForce: SensorReading[] = [
  { id: 'grf', name: 'Ground Reaction Force', unit: 'N', value: 0, min: 100, max: 1200, status: 'disconnected' },
  { id: 'heel-pres', name: 'Heel Pressure', unit: 'kPa', value: 0, min: 10, max: 400, status: 'disconnected' },
  { id: 'toe-pres', name: 'Toe Pressure', unit: 'kPa', value: 0, min: 10, max: 350, status: 'disconnected' },
]

function jitter(value: number, amount: number, min: number, max: number) {
  const next = value + (Math.random() - 0.5) * amount
  return Math.min(max, Math.max(min, next))
}

function seedSeries(count: number, base: number, amp: number): GraphPoint[] {
  return Array.from({ length: count }, (_, i) => ({
    t: i,
    value: base + Math.sin(i / 4) * amp + (Math.random() - 0.5) * 3,
  }))
}

/** Activate sensors — sets each to 'connected' with a realistic starting value */
function activate(sensors: SensorReading[]): SensorReading[] {
  const startValues: Record<string, number> = {
    'step-count': 0,
    cadence: 112,
    'stride-len': 72,
    'flex-l': 38,
    'flex-r': 41,
    grf: 580,
    'heel-pres': 185,
    'toe-pres': 140,
  }
  return sensors.map((s) => ({
    ...s,
    status: 'connected' as const,
    value: startValues[s.id] ?? s.min + (s.max - s.min) / 2,
  }))
}

function deactivate(sensors: SensorReading[]): SensorReading[] {
  return sensors.map((s) => ({ ...s, status: 'disconnected' as const, value: 0 }))
}

export function useMonitoringSensors() {
  const [running, setRunning] = useState(false)
  const [gait, setGait] = useState<SensorReading[]>(initialGait)
  const [joint, setJoint] = useState<SensorReading[]>(initialJoint)
  const [force, setForce] = useState<SensorReading[]>(initialForce)

  // Graph series for the two knee flexion lines
  const [flexLeftSeries, setFlexLeftSeries] = useState<GraphPoint[]>(() => seedSeries(GRAPH_WINDOW, 38, 6))
  const [flexRightSeries, setFlexRightSeries] = useState<GraphPoint[]>(() => seedSeries(GRAPH_WINDOW, 41, 5))
  const [forceSeries, setForceSeries] = useState<GraphPoint[]>(() => seedSeries(GRAPH_WINDOW, 580, 40))

  const stepRef = useRef(0)

  const start = useCallback(() => {
    stepRef.current = 0
    setGait(activate(initialGait))
    setJoint(activate(initialJoint))
    setForce(activate(initialForce))
    setFlexLeftSeries(seedSeries(GRAPH_WINDOW, 38, 6))
    setFlexRightSeries(seedSeries(GRAPH_WINDOW, 41, 5))
    setForceSeries(seedSeries(GRAPH_WINDOW, 580, 40))
    setRunning(true)
  }, [])

  const stop = useCallback(() => {
    setRunning(false)
    setGait(deactivate)
    setJoint(deactivate)
    setForce(deactivate)
  }, [])

  useEffect(() => {
    if (!running) return

    const id = window.setInterval(() => {
      stepRef.current += 1

      // Tick gait
      setGait((prev) =>
        prev.map((s) => {
          if (s.id === 'step-count') return { ...s, value: stepRef.current * 2 }
          const amt = s.id === 'cadence' ? 4 : 5
          return { ...s, value: Number(jitter(s.value, amt, s.min, s.max).toFixed(1)) }
        }),
      )

      // Tick joint
      setJoint((prev) =>
        prev.map((s) => ({
          ...s,
          value: Number(jitter(s.value, 6, s.min, s.max).toFixed(1)),
        })),
      )

      // Tick force
      setForce((prev) =>
        prev.map((s) => {
          const amt = s.id === 'grf' ? 40 : 20
          return { ...s, value: Number(jitter(s.value, amt, s.min, s.max).toFixed(1)) }
        }),
      )

      // Update graph series
      setFlexLeftSeries((prev) => {
        const last = prev[prev.length - 1]
        return [...prev.slice(1), { t: last.t + 1, value: jitter(last.value, 6, 18, 72) }]
      })
      setFlexRightSeries((prev) => {
        const last = prev[prev.length - 1]
        return [...prev.slice(1), { t: last.t + 1, value: jitter(last.value, 5, 20, 70) }]
      })
      setForceSeries((prev) => {
        const last = prev[prev.length - 1]
        return [...prev.slice(1), { t: last.t + 1, value: jitter(last.value, 40, 200, 1000) }]
      })
    }, TICK_MS)

    return () => window.clearInterval(id)
  }, [running])

  const connectedCount = [...gait, ...joint, ...force].filter((s) => s.status === 'connected').length
  const totalCount = gait.length + joint.length + force.length

  return {
    running,
    start,
    stop,
    sensors: { gait, joint, force },
    connectedCount,
    totalCount,
    graphs: { flexLeftSeries, flexRightSeries, forceSeries },
  }
}
