import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchPurchases } from '../../store/slices/buyerSlice'
import LoadingSpinner from '../Shared/LoadingSpinner'
import EmptyState from '../Shared/EmptyState'
import PurchaseTabs from './components/PurchaseTabs'
import PurchaseFilters from './components/PurchaseFilters'
import PurchaseCard from './components/PurchaseCard'

const ACTIVE_STATES = ['pending', 'pendiente_pago', 'paid_escrow', 'pagado_escrow']
const HISTORY_STATES = ['delivered_completed', 'entregado_completado', 'cancelled', 'cancelado_reembolsado', 'en_disputa']

function PurchaseList() {
  const dispatch = useDispatch()
  const { purchases, loading } = useSelector((s) => s.buyer)
  const [tab, setTab] = useState('activas')
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')

  useEffect(() => {
    dispatch(fetchPurchases())
  }, [dispatch])

  const filtered = useMemo(() => {
    let result = purchases

    if (tab === 'activas') {
      result = result.filter((p) => ACTIVE_STATES.includes(p.estado))
    } else if (tab === 'historial') {
      result = result.filter((p) => HISTORY_STATES.includes(p.estado))
    }

    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter((p) => p.producto?.titulo?.toLowerCase().includes(q))
    }
    if (category) {
      result = result.filter((p) => p.producto?.categoria === category)
    }

    return result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  }, [purchases, tab, search, category])

  if (loading) return <LoadingSpinner className="py-20" size="lg" />

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Mis Compras</h1>
        <p className="mt-1 text-sm text-slate-400">Historial de todos tus pedidos</p>
      </div>

      <PurchaseTabs activeTab={tab} onTabChange={setTab} />
      <PurchaseFilters
        search={search}
        onSearchChange={setSearch}
        category={category}
        onCategoryChange={setCategory}
      />

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <EmptyState
            icon="📦"
            title="Sin resultados"
            description={
              tab === 'activas'
                ? 'No tienes compras activas en este momento'
                : tab === 'historial'
                  ? 'No hay historial de compras'
                  : 'No se encontraron compras'
            }
          />
        ) : (
          filtered.map((purchase) => (
            <PurchaseCard key={purchase.id} purchase={purchase} />
          ))
        )}
      </div>
    </div>
  )
}

export default PurchaseList
