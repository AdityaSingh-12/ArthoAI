import { useAppState } from '../state/AppState'
import { useMonitoringSensors } from '../hooks/useMonitoringSensors'
import { LiveGraph } from '../components/dashboard/LiveGraph'
import { IconActivity } from '../components/icons'
import type { SensorReading } from '../types'

function statusLabel(status: SensorReading['status']) {
  if (status === 'connected') return 'Connected'
  if (status === 'idle') return 'Idle'
  return 'Disconnected'
}

function SensorCard({ sensor }: { sensor: SensorReading }) {
  return (
    <article className="sensor-card">
      <div className="sensor-card-top">
        <p>{sensor.name}</p>
        <span className={`chip chip-${sensor.status}`}>{statusLabel(sensor.status)}</span>
      </div>
      <p className="sensor-value">
        {sensor.status === 'connected' ? sensor.value : '—'}
        <small>{sensor.unit}</small>
      </p>
      <div className="meter" aria-hidden="true">
        <span
          style={{
            width:
              sensor.status === 'connected'
                ? `${((sensor.value - sensor.min) / (sensor.max - sensor.min)) * 100}%`
                : '0%',
          }}
        />
      </div>
    </article>
  )
}

export function LiveMonitoring() {
  const { selectedPatient, setPage, setSelectedPatient } = useAppState()
  const { running, start, stop, sensors, connectedCount, totalCount, graphs } =
    useMonitoringSensors()

  function handleBack() {
    setSelectedPatient(null)
    setPage('patients')
  }

  if (!selectedPatient) {
    return (
      <section className="panel" style={{ textAlign: 'center', padding: '60px 20px' }}>
        <p>No patient selected.</p>
        <button type="button" className="btn-primary" style={{ marginTop: 16 }} onClick={handleBack}>
          Go to Patients
        </button>
      </section>
    )
  }

  return (
    <div className="monitoring-page">
      {/* ── Patient Info Bar ── */}
      <section className="monitoring-patient-bar">
        <button type="button" className="btn-ghost monitoring-back" onClick={handleBack} aria-label="Back to patients">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
          Back
        </button>
        <div className="monitoring-patient-info">
          <div className="monitoring-avatar">
            {selectedPatient.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="monitoring-patient-name">{selectedPatient.name}</h2>
            <p className="monitoring-patient-meta">
              ID: {selectedPatient.id} · {selectedPatient.age} years
              {selectedPatient.village ? ` · ${selectedPatient.village}` : ''}
              {selectedPatient.phone ? ` · ${selectedPatient.phone}` : ''}
            </p>
          </div>
        </div>
        <div className="monitoring-controls">
          <span className={`status-pill ${running ? '' : 'status-pill--off'}`}>
            {running ? <span className="pulse" /> : <span className="pulse-off" />}
            {running ? `${connectedCount}/${totalCount} sensors online` : 'Sensors disconnected'}
          </span>
          {running ? (
            <button type="button" className="btn-stop" onClick={stop}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2" /></svg>
              Stop Monitoring
            </button>
          ) : (
            <button type="button" className="btn-primary" onClick={start}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3" /></svg>
              Start Monitoring
            </button>
          )}
        </div>
      </section>

      {/* ── Sensor Group: Gait & Movement ── */}
      <section className="panel sensor-panel">
        <div className="panel-header">
          <div>
            <div className="panel-title-row">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M13 4v16M7 4v16M19 4v16M4 8h16M4 16h16" /></svg>
              <h2>Gait &amp; Movement</h2>
            </div>
            <p className="panel-sub">Step count, cadence, and stride length</p>
          </div>
        </div>
        <div className="sensor-grid sensor-grid--3">
          {sensors.gait.map((s) => (
            <SensorCard key={s.id} sensor={s} />
          ))}
        </div>
      </section>

      {/* ── Sensor Group: Joint Angles ── */}
      <section className="panel sensor-panel">
        <div className="panel-header">
          <div>
            <div className="panel-title-row">
              <IconActivity size={18} />
              <h2>Joint Angle Readings</h2>
            </div>
            <p className="panel-sub">Knee flexion angles from IMU sensors</p>
          </div>
        </div>
        <div className="sensor-grid sensor-grid--2">
          {sensors.joint.map((s) => (
            <SensorCard key={s.id} sensor={s} />
          ))}
        </div>

        {/* Dual-line graph */}
        <div className="monitoring-graphs-row">
          <div className="graph-block">
            <div className="graph-legend">
              <strong>Left Knee Flexion</strong>
              <span>Last {graphs.flexLeftSeries.length} samples · {running ? 'live' : 'paused'}</span>
            </div>
            <LiveGraph series={graphs.flexLeftSeries} />
          </div>
          <div className="graph-block">
            <div className="graph-legend">
              <strong>Right Knee Flexion</strong>
              <span>Last {graphs.flexRightSeries.length} samples · {running ? 'live' : 'paused'}</span>
            </div>
            <LiveGraph series={graphs.flexRightSeries} />
          </div>
        </div>
      </section>

      {/* ── Sensor Group: Pressure / Force ── */}
      <section className="panel sensor-panel">
        <div className="panel-header">
          <div>
            <div className="panel-title-row">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M2 12h20" /><circle cx="12" cy="12" r="4" /></svg>
              <h2>Pressure &amp; Force</h2>
            </div>
            <p className="panel-sub">Ground reaction force, heel and toe pressure</p>
          </div>
        </div>
        <div className="sensor-grid sensor-grid--3">
          {sensors.force.map((s) => (
            <SensorCard key={s.id} sensor={s} />
          ))}
        </div>

        <div className="graph-block">
          <div className="graph-legend">
            <strong>Ground Reaction Force</strong>
            <span>Last {graphs.forceSeries.length} samples · {running ? 'live' : 'paused'}</span>
          </div>
          <LiveGraph series={graphs.forceSeries} />
        </div>
      </section>
    </div>
  )
}
