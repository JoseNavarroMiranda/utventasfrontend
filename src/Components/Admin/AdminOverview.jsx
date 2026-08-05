import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchAdminMetrics } from '../../store/slices/adminSlice'
import LoadingSpinner from '../Shared/LoadingSpinner'

function MetricCard({ label, value, color }) {
  return (
    <div className={`rounded-2xl border border-white/10 bg-slate-900 p-6 ${color}`}>
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-2 text-3xl font-bold text-white">{value}</p>
    </div>
  )
}

function AdminOverview() {
  const dispatch = useDispatch()
  const { metrics, loading } = useSelector((s) => s.admin)

  useEffect(() => {
    dispatch(fetchAdminMetrics())
  }, [dispatch])

  const disputeCount = metrics.disputas_activas || 0
  const isLoading = loading

  if (isLoading && !metrics.total_usuarios) {
    return <LoadingSpinner className="py-20" size="lg" />
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard Administrativo</h1>
        <p className="mt-1 text-sm text-slate-400">Metricas globales del campus UTJ</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Usuarios Verificados" value={metrics.usuarios_verificados} color="border-l-4 border-l-cyan-400" />
        <MetricCard label="Transacciones del Dia" value={metrics.pedidos_completados} color="border-l-4 border-l-emerald-400" />
        <MetricCard label="Dinero en Escrow" value={`$${(metrics.fondos_en_escrow || 0).toLocaleString()} MXN`} color="border-l-4 border-l-blue-400" />
        <MetricCard label="Disputas Activas" value={disputeCount || metrics.disputas_activas || 0} color="border-l-4 border-l-red-400" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-slate-900 p-6">
          <h2 className="mb-4 text-lg font-bold text-white">Usuarios</h2>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Totales</span>
              <span className="font-medium text-white">{metrics.total_usuarios}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Verificados</span>
              <span className="font-medium text-emerald-400">{metrics.usuarios_verificados}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Suspendidos</span>
              <span className="font-medium text-red-400">{metrics.total_usuarios - metrics.usuarios_verificados}</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-900 p-6">
          <h2 className="mb-4 text-lg font-bold text-white">Plataforma</h2>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Productos publicados</span>
              <span className="font-medium text-white">{metrics.productos_publicados || 0}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Ventas totales</span>
              <span className="font-medium text-white">{metrics.pedidos_completados || 0}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Dinero en Escrow</span>
              <span className="font-medium text-yellow-400">${(metrics.fondos_en_escrow || 0).toLocaleString()} MXN</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-900 p-6">
          <h2 className="mb-4 text-lg font-bold text-white">Alertas</h2>
          {disputeCount === 0 && metrics.disputas_activas === 0 ? (
            <p className="text-sm text-slate-500">Sin alertas activas</p>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center gap-2 rounded-lg bg-red-400/10 px-3 py-2 text-sm text-red-300">
                <span className="h-2 w-2 rounded-full bg-red-400" />
                {disputeCount || metrics.disputas_activas} disputa{(disputeCount || metrics.disputas_activas) !== 1 ? 's' : ''} pendiente{(disputeCount || metrics.disputas_activas) !== 1 ? 's' : ''} de resolver
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminOverview
