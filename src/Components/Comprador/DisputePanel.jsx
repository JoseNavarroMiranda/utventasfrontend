import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router'
import { fetchPurchases, openDispute } from '../../store/slices/buyerSlice'
import LoadingSpinner from '../Shared/LoadingSpinner'
import EmptyState from '../Shared/EmptyState'
import DisputeForm from './components/DisputeForm'
import PurchaseCard from './components/PurchaseCard'

function DisputePanel() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { purchases, loading } = useSelector((s) => s.buyer)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(null)

  const preselected = location.state?.purchase || null

  useEffect(() => {
    dispatch(fetchPurchases())
  }, [dispatch])

  const disputable = purchases.filter((p) => p.estado === 'paid_escrow')

  const handleSubmit = async ({ motivo, descripcion }) => {
    setSubmitting(true)
    const target = preselected || disputable[0]
    if (!target) { setSubmitting(false); return }
    try {
      await dispatch(openDispute({ purchaseId: target.id, motivo, descripcion })).unwrap()
      setSuccess(`Disputa reportada para "${target.producto?.titulo}". Un administrador revisará tu caso.`)
      dispatch(fetchPurchases())
    } catch {
      setSuccess(null)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <LoadingSpinner className="py-20" size="lg" />

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Panel de Disputas</h1>
        <p className="mt-1 text-sm text-slate-400">
          Reporta incidencias si el producto no coincide o el vendedor no se presentó
        </p>
      </div>

      {success && (
        <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-4">
          <p className="text-sm text-emerald-300">{success}</p>
        </div>
      )}

      {disputable.length === 0 && !preselected ? (
        <EmptyState
          icon="🔒"
          title="Sin incidencias"
          description="No tienes pedidos activos que puedan ser reportados"
        />
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <h2 className="mb-4 text-lg font-bold text-white">
              {preselected ? 'Reportar incidencia' : 'Selecciona un pedido'}
            </h2>

            {!preselected && (
              <div className="space-y-3">
                {disputable.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => navigate('/comprador/disputas', { state: { purchase: p } })}
                    className="w-full text-left"
                  >
                    <PurchaseCard purchase={p} />
                  </button>
                ))}
              </div>
            )}

            {preselected && (
              <DisputeForm purchase={preselected} onSubmit={handleSubmit} submitting={submitting} />
            )}
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900 p-6">
            <h2 className="mb-4 text-lg font-bold text-white">Proceso de Disputa</h2>
            <ol className="space-y-4 text-sm text-slate-300">
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-400/10 text-xs font-bold text-blue-300">1</span>
                <span>Selecciona el pedido con el que tienes el problema</span>
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-400/10 text-xs font-bold text-blue-300">2</span>
                <span>Indica el motivo y describe detalladamente la situación</span>
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-400/10 text-xs font-bold text-blue-300">3</span>
                <span>El pedido cambiará a estado <strong>En Disputa</strong></span>
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-400/10 text-xs font-bold text-blue-300">4</span>
                <span>Un administrador revisará el caso y mediará entre ambas partes</span>
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-400/10 text-xs font-bold text-blue-300">5</span>
                <span>Recibirás una notificación con la resolución</span>
              </li>
            </ol>
          </div>
        </div>
      )}
    </div>
  )
}

export default DisputePanel
