import type { GraphPoint, SensorReading } from '../../types'
import { IconActivity } from '../icons'
import { LiveGraph } from './LiveGraph'

type LiveSensorMonitoringProps = {
  sensors: SensorReading[]
  series: GraphPoint[]
}

function statusLabel(status: SensorReading['status']) {
  if (status === 'connected') return 'Connected'
  if (status === 'idle') return 'Idle'
  return 'Disconnected'
}

export function LiveSensorMonitoring({ sensors, series }: LiveSensorMonitoringProps) {
  const connected = sensors.filter((s) => s.status === 'connected').length

  return (
    <section className="panel sensor-panel">
      <div className="panel-header">
        <div>
          <div className="panel-title-row">
            <IconActivity size={18} />
            <h2>Live Sensor Monitoring</h2>
          </div>
          <p className="panel-sub">Mock IMU and force streams for UI preview</p>
        </div>
        <span className="status-pill">
          <span className="pulse" />
          {connected}/{sensors.length} sensors online
        </span>
      </div>

      <div className="sensor-grid">
        {sensors.map((sensor) => (
          <article key={sensor.id} className="sensor-card">
            <div className="sensor-card-top">
              <p>{sensor.name}</p>
              <span className={`chip chip-${sensor.status}`}>{statusLabel(sensor.status)}</span>
            </div>
            <p className="sensor-value">
              {sensor.value}
              <small>{sensor.unit}</small>
            </p>
            <div className="meter" aria-hidden="true">
              <span
                style={{
                  width: `${((sensor.value - sensor.min) / (sensor.max - sensor.min)) * 100}%`,
                }}
              />
            </div>
          </article>
        ))}
      </div>

      <div className="graph-block">
        <div className="graph-legend">
          <strong>Left knee flexion</strong>
          <span>Last 40 samples · updating every 0.8s</span>
        </div>
        <LiveGraph series={series} />
      </div>
    </section>
  )
}
