type EmptyStateProps = {
  title: string
  hint: string
}

export function EmptyState({ title, hint }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <p className="empty-title">{title}</p>
      <p>{hint}</p>
    </div>
  )
}
