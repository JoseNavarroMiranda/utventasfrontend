import Button from './Button'

function EmptyState({ icon, title, description, actionLabel, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {icon && <span className="mb-4 text-5xl">{icon}</span>}
      <h3 className="text-xl font-bold text-white">{title}</h3>
      {description && (
        <p className="mt-2 max-w-md text-sm text-slate-400">{description}</p>
      )}
      {actionLabel && onAction && (
        <Button className="mt-6" onClick={onAction}>{actionLabel}</Button>
      )}
    </div>
  )
}

export default EmptyState
