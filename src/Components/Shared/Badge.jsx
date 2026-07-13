const colorMap = {
  yellow: 'bg-yellow-400/15 text-yellow-200',
  emerald: 'bg-emerald-400/15 text-emerald-200',
  green: 'bg-green-400/15 text-green-200',
  blue: 'bg-blue-400/15 text-blue-200',
  red: 'bg-red-400/15 text-red-200',
  cyan: 'bg-cyan-400/15 text-cyan-200',
  indigo: 'bg-indigo-400/15 text-indigo-200',
  slate: 'bg-slate-400/15 text-slate-200',
}

function Badge({ children, color = 'slate', className = '' }) {
  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${colorMap[color] || colorMap.slate} ${className}`}
    >
      {children}
    </span>
  )
}

export default Badge
