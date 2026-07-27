import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router'
import { fetchProducts } from '../../store/slices/productSlice'
import { fetchSales } from '../../store/slices/saleSlice'
import LoadingSpinner from '../Shared/LoadingSpinner'
import Badge from '../Shared/Badge'
import { ORDER_STATUS } from '../../constants'

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
  const { items: products, loading: productsLoading } = useSelector((s) => s.products)
  const { items: sales, loading: salesLoading } = useSelector((s) => s.sales)
  const { balance, loading: wLoading } = useSelector((s) => s.withdrawals)

  useEffect(() => {
    dispatch(fetchProducts())
    dispatch(fetchSales())
  }, [dispatch])

  const loading = productsLoading || salesLoading || wLoading

  const activeProducts = products.filter((p) => p.es_activo !== false).length
  const monthSales = sales.filter((s) => {
    if (!s.created_at) return false
    const d = new Date(s.created_at)
    const now = new Date()
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  }).length
  const pendingTokenSales = sales.filter((s) => s.estado === 'paid_escrow').length

  if (loading) return <LoadingSpinner className="py-20" size="lg" />

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard del Vendedor</h1>
        <p className="mt-1 text-sm text-slate-400">Resumen de tu actividad comercial</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Ventas del Mes" value={monthSales} color="border-l-4 border-l-cyan-400" />
        <StatCard label="Saldo Disponible" value={`$${(balance || 0).toLocaleString()} MXN`} color="border-l-4 border-l-emerald-400" />
        <StatCard label="Publicaciones Activas" value={activeProducts} color="border-l-4 border-l-blue-400" />
        <StatCard label="Pendientes de Token" value={pendingTokenSales} color="border-l-4 border-l-yellow-400" />
      </div>

      <div className="rounded-2xl border border-white/10 bg-slate-900 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Ventas Recientes</h2>
            <Link to="/vendedor/ventas" className="text-sm text-cyan-400 hover:text-cyan-300">Ver todas</Link>
          </div>
          {sales.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-500">Aún no tienes ventas</p>
          ) : (
            <div className="space-y-3">
              {sales.slice(0, 5).map((sale) => (
                <div key={sale.id} className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-white">{sale.producto?.titulo || 'Producto'}</p>
                    <p className="text-xs text-slate-400">${(sale.monto || 0).toLocaleString()} MXN</p>
                  </div>
                  <Badge color={(ORDER_STATUS[sale.estado] || {}).color}>
                    {(ORDER_STATUS[sale.estado] || {}).label || sale.estado}
                  </Badge>
                </div>
              ))}
            </div>
          )}
      </div>
    </div>
  )
}

export default DashboardOverview
