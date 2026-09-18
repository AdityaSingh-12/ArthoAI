import type { Assessment } from '../../types'

type RecentAssessmentsProps = {
  assessments: Assessment[]
}

export function RecentAssessments({ assessments }: RecentAssessmentsProps) {
  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <h2>Recent assessments</h2>
          <p className="panel-sub">Latest OA risk reviews in this session</p>
        </div>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Patient</th>
              <th>Age</th>
              <th>Joint</th>
              <th>Score</th>
              <th>Risk</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {assessments.map((row) => (
              <tr key={row.id}>
                <td className="mono">{row.id}</td>
                <td>{row.patientName}</td>
                <td>{row.age}</td>
                <td>{row.joint}</td>
                <td>{row.score}</td>
                <td>
                  <span className={`risk-badge risk-${(row.risk || 'low').toLowerCase()}`}>{row.risk || 'Low'}</span>
                </td>
                <td className="muted">{row.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
