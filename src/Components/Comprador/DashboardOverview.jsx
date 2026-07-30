import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router'
import { fetchPurchases } from '../../store/slices/buyerSlice'
import LoadingSpinner from '../Shared/LoadingSpinner'
import EmptyState from '../Shared/EmptyState'
import PurchaseFilters from './components/PurchaseFilters'
import PurchaseCard from './components/PurchaseCard'

function StatCard({ label, value, color }) {
  return (
    <div className={`rounded-2xl border border-white/10 bg-slate-900 p-6 ${color}`}>
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-2 text-3xl font-bold text-white">{value}</p>
    </div>
  )
}

function DashboardOverview() {
  const dispatch = useDispatch()
  const { purchases, loading } = useSelector((s) => s.buyer)
  const { user } = useSelector((s) => s.auth)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')

  useEffect(() => {
    dispatch(fetchPurchases())
  }, [dispatch])

  const filtered = useMemo(() => {
    let result = purchases
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter((p) => p.producto?.titulo?.toLowerCase().includes(q))
    }
    if (category) {
      result = result.filter((p) => p.producto?.categoria === category)
    }
    return result
  }, [purchases, search, category])

  const activeCount = purchases.filter((p) => p.estado === 'pending' || p.estado === 'pendiente_pago' || p.estado === 'paid_escrow' || p.estado === 'pagado_escrow').length
  const completedCount = purchases.filter((p) => p.estado === 'delivered_completed' || p.estado === 'entregado_completado').length
  const escrowTotal = purchases
    .filter((p) => p.estado === 'paid_escrow')
    .reduce((sum, p) => sum + (p.monto || 0), 0)
  const disputeCount = purchases.filter((p) => p.estado === 'en_disputa').length

  if (loading) return <LoadingSpinner className="py-20" size="lg" />

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">
          ¡Hola, {user?.nombre || 'Comprador'}!
        </h1>
        <p className="mt-1 text-sm text-slate-400">Resumen de tu actividad como comprador</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Compras Activas" value={activeCount} color="border-l-4 border-l-blue-400" />
        <StatCard label="Completadas" value={completedCount} color="border-l-4 border-l-emerald-400" />
        <StatCard label="En Escrow" value={`$${escrowTotal.toLocaleString()} MXN`} color="border-l-4 border-l-yellow-400" />
        <StatCard label="En Disputa" value={disputeCount} color="border-l-4 border-l-red-400" />
      </div>

      <div className="rounded-2xl border border-white/10 bg-slate-900 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Tus Compras</h2>
          <Link to="/comprador/compras" className="text-sm text-blue-400 hover:text-blue-300">
            Ver todas
          </Link>
        </div>

        <PurchaseFilters
          search={search}
          onSearchChange={setSearch}
          category={category}
          onCategoryChange={setCategory}
        />

        <div className="mt-4 space-y-3">
          {filtered.length === 0 ? (
            <EmptyState
              icon="🛒"
              title="No hay compras"
              description={search || category ? 'Intenta con otros filtros' : 'Aún no has realizado ninguna compra'}
            />
          ) : (
            filtered.slice(0, 6).map((purchase) => (
              <PurchaseCard key={purchase.id} purchase={purchase} />
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default DashboardOverview
