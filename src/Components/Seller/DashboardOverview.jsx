import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router'
import { fetchProducts } from '../../store/slices/productSlice'
import { fetchSales } from '../../store/slices/saleSlice'
import LoadingSpinner from '../Shared/LoadingSpinner'
import Badge from '../Shared/Badge'
import Button from '../Shared/Button'
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
  const { user } = useSelector((s) => s.auth)
  const { items: products, loading: productsLoading } = useSelector((s) => s.products)
  const { items: sales, loading: salesLoading } = useSelector((s) => s.sales)
  const { items: withdrawals } = useSelector((s) => s.withdrawals)

  useEffect(() => {
    dispatch(fetchProducts())
    dispatch(fetchSales())
  }, [dispatch])

  const loading = productsLoading || salesLoading

  const activeProducts = products.filter((p) => p.es_activo !== false).length
  const monthSales = sales.filter((s) => {
    if (!s.created_at) return false
    const d = new Date(s.created_at)
    const now = new Date()
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  }).length
  const pendingTokenSales = sales.filter((s) => s.estado === 'paid_escrow').length
  const escrowTotal = sales
    .filter((s) => s.estado === 'paid_escrow')
    .reduce((sum, s) => sum + (s.monto || 0), 0)

  const completedTotal = useMemo(
    () => sales
      .filter((s) => s.estado === 'delivered_completed')
      .reduce((sum, s) => sum + (s.monto || 0), 0),
    [sales]
  )
  const pendingWithdrawals = useMemo(
    () => withdrawals
      .filter((w) => w.estado === 'pending')
      .reduce((sum, w) => sum + (w.monto || 0), 0),
    [withdrawals]
  )
  const availableBalance = completedTotal - pendingWithdrawals

  if (loading) return <LoadingSpinner className="py-20" size="lg" />

  return (
    <div className="space-y-8">
      {user?.rol === 'Vendedor' && !user?.verificado_como_vendedor && (
        <div className="rounded-2xl border border-amber-400/20 bg-amber-400/5 p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <svg className="h-8 w-8 shrink-0 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div>
                <p className="font-semibold text-amber-200">Cuenta no verificada</p>
                <p className="text-sm text-amber-300/70">
                  Verifica tu cuenta para obtener la insignia de vendedor confiable.
                </p>
              </div>
            </div>
            <Link to="/vendedor/verificacion">
              <Button size="sm">Verificar ahora</Button>
            </Link>
          </div>
        </div>
      )}

      {user?.verificado_como_vendedor && (
        <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-4">
          <div className="flex items-center gap-3">
            <svg className="h-8 w-8 shrink-0 text-emerald-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
            </svg>
            <div>
              <p className="font-semibold text-emerald-200">Vendedor Verificado</p>
              <p className="text-sm text-emerald-300/70">
                Tu insignia de verificado aparece en tus publicaciones.
              </p>
            </div>
          </div>
        </div>
      )}

      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard del Vendedor</h1>
        <p className="mt-1 text-sm text-slate-400">Resumen de tu actividad comercial</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
        <StatCard label="Ventas del Mes" value={monthSales} color="border-l-4 border-l-cyan-400" />
        <StatCard label="Monto en Escrow" value={`$${escrowTotal.toLocaleString()} MXN`} color="border-l-4 border-l-amber-400" />
        <StatCard label="Saldo Disponible" value={`$${(availableBalance || 0).toLocaleString()} MXN`} color="border-l-4 border-l-emerald-400" />
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
