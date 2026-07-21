const TABS = [
  { key: 'activas', label: 'Pendientes / Pagados' },
  { key: 'historial', label: 'Completados / Cancelados' },
  { key: 'todas', label: 'Todas' },
]

function PurchaseTabs({ activeTab, onTabChange }) {
  return (
    <div className="flex gap-1 rounded-xl border border-white/10 bg-slate-900 p-1">
      {TABS.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onTabChange(tab.key)}
          className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition ${
            activeTab === tab.key
              ? 'bg-blue-400/10 text-blue-300'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

export { TABS }
export default PurchaseTabs
