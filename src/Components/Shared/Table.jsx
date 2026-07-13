import { Children } from 'react'

function Table({ headers, children, emptyMessage = 'Sin datos' }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-800/50">
          <tr>
            {headers.map((h, i) => (
              <th key={i} className={`px-4 py-3 font-medium text-slate-300 ${h.right ? 'text-right' : ''}`}>
                {h.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {children}
        </tbody>
      </table>
      {Children.count(children) === 0 && (
        <p className="py-12 text-center text-sm text-slate-500">{emptyMessage}</p>
      )}
    </div>
  )
}

function Td({ children, right, className = '' }) {
  return (
    <td className={`px-4 py-3 ${right ? 'text-right' : ''} ${className}`}>{children}</td>
  )
}

export { Table, Td }
