import type { Assessment } from '../../types'

type SummaryCardsProps = {
  assessments: Assessment[]
}

export function SummaryCards({ assessments }: SummaryCardsProps) {
  const total = assessments.length
  const low = assessments.filter((a) => a.risk === 'Low').length
  const moderate = assessments.filter((a) => a.risk === 'Moderate').length
  const high = assessments.filter((a) => a.risk === 'High').length

  const cards = [
    { label: 'Total', value: total, hint: 'Recorded assessments', tone: 'neutral' },
    { label: 'Low Risk', value: low, hint: 'Routine follow-up', tone: 'low' },
    { label: 'Moderate Risk', value: moderate, hint: 'Monitor closely', tone: 'moderate' },
    { label: 'High Risk', value: high, hint: 'Priority review', tone: 'high' },
  ] as const

  return (
    <section className="summary-grid" aria-label="Risk summary">
      {cards.map((card) => (
        <article key={card.label} className={`summary-card tone-${card.tone}`}>
          <p className="summary-label">{card.label}</p>
          <p className="summary-value">{card.value}</p>
          <p className="summary-hint">{card.hint}</p>
        </article>
      ))}
    </section>
  )
}
