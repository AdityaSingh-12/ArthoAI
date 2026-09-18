import { useEffect, useState } from 'react'
import { initialSensors } from '../data/mockData'
import type { GraphPoint, SensorReading } from '../types'

const GRAPH_WINDOW = 40

function jitter(value: number, amount: number, min: number, max: number) {
  const next = value + (Math.random() - 0.5) * amount
  return Math.min(max, Math.max(min, next))
}

export function useLiveSensors() {
  const [sensors, setSensors] = useState<SensorReading[]>(initialSensors)
  const [series, setSeries] = useState<GraphPoint[]>(() =>
    Array.from({ length: GRAPH_WINDOW }, (_, i) => ({
      t: i,
      value: 40 + Math.sin(i / 3) * 8,
    })),
  )
  useEffect(() => {
    const id = window.setInterval(() => {
      setSensors((prev) =>
        prev.map((sensor) => {
          if (sensor.status !== 'connected') return sensor
          const amount = sensor.id === 'force' ? 40 : sensor.id === 'cadence' ? 4 : 6
          return {
            ...sensor,
            value: Number(jitter(sensor.value, amount, sensor.min, sensor.max).toFixed(1)),
          }
        }),
      )

      setSeries((prev) => {
        const last = prev[prev.length - 1]?.value ?? 40
        const nextValue = jitter(last, 6, 18, 72)
        const next = [...prev.slice(1), { t: prev[prev.length - 1].t + 1, value: nextValue }]
        return next
      })
    }, 800)

    return () => window.clearInterval(id)
  }, [])

  return { sensors, series }
}
