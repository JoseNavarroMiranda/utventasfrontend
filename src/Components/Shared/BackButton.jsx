import { Link } from 'react-router'

function BackButton({ to = '/', className = '' }) {
  return (
    <Link
      to={to}
      className={`inline-flex items-center gap-1 text-sm text-slate-400 transition hover:text-slate-200 ${className}`}
    >
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
      Regresar
    </Link>
  )
}

export default BackButton
