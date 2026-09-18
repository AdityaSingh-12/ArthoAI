import { useMemo } from 'react'
import type { GraphPoint } from '../../types'

type LiveGraphProps = {
  series: GraphPoint[]
}

export function LiveGraph({ series }: LiveGraphProps) {
  const { path, area, last } = useMemo(() => {
    const w = 640
    const h = 180
    const pad = 8
    const values = series.map((p) => p.value)
    const min = Math.min(...values, 0)
    const max = Math.max(...values, 80)
    const span = Math.max(max - min, 1)

    const coords = series.map((p, i) => {
      const x = pad + (i / Math.max(series.length - 1, 1)) * (w - pad * 2)
      const y = h - pad - ((p.value - min) / span) * (h - pad * 2)
      return { x, y }
    })

    const pathD = coords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`).join(' ')
    const areaD = `${pathD} L ${coords[coords.length - 1].x.toFixed(1)} ${h} L ${coords[0].x.toFixed(1)} ${h} Z`
    const lastPoint = coords[coords.length - 1]

    return { path: pathD, area: areaD, last: lastPoint }
  }, [series])

  return (
    <div className="graph-wrap">
      <svg viewBox="0 0 640 180" className="live-graph" role="img" aria-label="Live left knee flexion">
        <defs>
          <linearGradient id="graphFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#14B8A6" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#14B8A6" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {[45, 90, 135].map((y) => (
          <line key={y} x1="0" x2="640" y1={y} y2={y} className="graph-grid" />
        ))}
        <path d={area} fill="url(#graphFill)" />
        <path d={path} className="graph-line" />
        {last && <circle cx={last.x} cy={last.y} r="5" className="graph-dot" />}
      </svg>
    </div>
  )
}
