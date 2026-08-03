import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMyWithdrawals } from '../../store/slices/withdrawalSlice'
import { WITHDRAWAL_STATUS } from '../../constants'
import Badge from '../Shared/Badge'

function WithdrawalPanel() {
  const dispatch = useDispatch()
  const { items: sales } = useSelector((s) => s.sales)
  const { items: withdrawals, loading: wLoading, error: wError } = useSelector((s) => s.withdrawals)
  useEffect(() => {
    dispatch(fetchMyWithdrawals())
  }, [dispatch])

  const completedSales = useMemo(
    () => sales.filter((s) => s.estado === 'delivered_completed'),
    [sales]
  )
  const completedTotal = useMemo(
    () => completedSales.reduce((sum, s) => sum + (s.monto || 0), 0),
    [completedSales]
  )
  const pendingWithdrawalTotal = useMemo(
    () => withdrawals
      .filter((w) => w.estado === 'pending')
      .reduce((sum, w) => sum + (w.monto || 0), 0),
    [withdrawals]
  )
  const availableBalance = completedTotal - pendingWithdrawalTotal

  const pendingTotal = withdrawals
    .filter((w) => w.estado === 'pending')
    .reduce((sum, w) => sum + (w.monto || 0), 0)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Panel de Retiros</h1>
        <p className="mt-1 text-sm text-slate-400">Retira tus ganancias a tu cuenta de PayPal</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">Saldo Disponible</p>
            <p className="mt-2 text-3xl font-bold text-emerald-400">
              ${(availableBalance || 0).toLocaleString()} <span className="text-base text-slate-500">MXN</span>
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {completedSales.length} venta{completedSales.length !== 1 ? 's' : ''} completada{completedSales.length !== 1 ? 's' : ''}
            </p>
          </div>
        <div className="rounded-2xl border border-white/10 bg-slate-900 p-6">
          <p className="text-sm text-slate-400">Retiros Pendientes</p>
          <p className="mt-2 text-3xl font-bold text-yellow-400">
            ${pendingTotal.toLocaleString()} <span className="text-base text-slate-500">MXN</span>
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-slate-900 p-6">
          <p className="text-sm text-slate-400">Total Retirado</p>
          <p className="mt-2 text-3xl font-bold text-white">
            ${withdrawals
              .filter((w) => w.estado === 'processed_payout')
              .reduce((sum, w) => sum + (w.monto || 0), 0)
              .toLocaleString()} <span className="text-base text-slate-500">MXN</span>
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-1">
        <div className="rounded-2xl border border-white/10 bg-slate-900 p-6">
          <h2 className="mb-4 text-lg font-bold text-white">Historial de Retiros</h2>

          {completedSales.length > 0 && (
            <div className="mb-6">
              <h3 className="mb-3 text-sm font-semibold text-slate-400">Ventas Completadas</h3>
              <div className="space-y-2">
                {completedSales.map((s) => (
                  <div key={s.id} className="flex items-center justify-between rounded-xl bg-emerald-400/5 px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-white">{s.producto?.titulo || 'Producto'}</p>
                      <p className="text-xs text-slate-400">
                        ${(s.monto || 0).toLocaleString()} MXN
                        {s.created_at && (
                          <span className="ml-2 text-slate-500">
                            {new Date(s.created_at).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}
                          </span>
                        )}
                      </p>
                    </div>
                    <Badge color="blue">Disponible</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {wLoading && <p className="py-4 text-center text-sm text-slate-500">Cargando retiros...</p>}

          {wError && (
            <div className="mb-4 rounded-xl bg-red-400/10 px-4 py-3 text-sm text-red-300">{wError}</div>
          )}

          {!wLoading && withdrawals.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-500">No has solicitado retiros aún</p>
          ) : (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-slate-400">Solicitudes de Retiro</h3>
              {withdrawals.map((w) => {
                const status = WITHDRAWAL_STATUS[w.estado] || {}
                return (
                  <div key={w.id} className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-white">${(w.monto || 0).toLocaleString()} MXN</p>
                      <p className="text-xs text-slate-400">PayPal: {w.correo_paypal_destino || '—'}</p>
                      {w.created_at && (
                        <p className="text-xs text-slate-500">
                          {new Date(w.created_at).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                      )}
                    </div>
                    <Badge color={status.color}>{status.label || w.estado}</Badge>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default WithdrawalPanel
