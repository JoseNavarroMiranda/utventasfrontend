import { CATEGORIES } from '../../../constants'

function PurchaseFilters({ search, onSearchChange, category, onCategoryChange }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <div className="relative flex-1">
        <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Buscar productos..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-slate-800 py-2.5 pr-4 pl-10 text-sm text-white placeholder-slate-400 outline-none transition focus:border-blue-400/50 focus:ring-1 focus:ring-blue-400/20"
        />
      </div>
      <select
        value={category}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="rounded-xl border border-white/10 bg-slate-800 px-4 py-2.5 text-sm text-white outline-none transition focus:border-blue-400/50 focus:ring-1 focus:ring-blue-400/20"
      >
        <option value="">Todas las categorías</option>
        {CATEGORIES.map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>
    </div>
  )
}

export default PurchaseFilters
