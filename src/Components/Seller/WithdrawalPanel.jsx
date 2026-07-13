import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchWithdrawals, requestWithdrawal } from '../../store/slices/withdrawalSlice'
import { WITHDRAWAL_STATUS } from '../../constants'
import LoadingSpinner from '../Shared/LoadingSpinner'
import Badge from '../Shared/Badge'
import Button from '../Shared/Button'
import Input from '../Shared/Input'

function WithdrawalPanel() {
  const dispatch = useDispatch()
  const { items: withdrawals, balance, loading, error } = useSelector((s) => s.withdrawals)
  const [paypalEmail, setPaypalEmail] = useState('')
  const [amount, setAmount] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [formErrors, setFormErrors] = useState({})

  useEffect(() => {
    dispatch(fetchWithdrawals())
  }, [dispatch])

  const validateForm = () => {
    const errs = {}
    if (!paypalEmail.trim()) errs.paypalEmail = 'El correo de PayPal es obligatorio'
    else if (!/\S+@\S+\.\S+/.test(paypalEmail)) errs.paypalEmail = 'Correo electrónico inválido'

    const num = Number(amount)
    if (!amount || num <= 0) errs.amount = 'Ingresa un monto válido'
    else if (num > balance) errs.amount = `El monto máximo disponible es $${balance.toLocaleString()} MXN`
    else if (num < 10) errs.amount = 'El monto mínimo es $10 MXN'

    setFormErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setSubmitting(true)
    const result = await dispatch(requestWithdrawal({
      correo_paypal_destino: paypalEmail.trim(),
      monto: Number(amount),
    }))
    setSubmitting(false)

    if (result.meta.requestStatus === 'fulfilled') {
      setPaypalEmail('')
      setAmount('')
      dispatch(fetchWithdrawals())
    }
  }

  if (loading && withdrawals.length === 0) {
    return <LoadingSpinner className="py-20" size="lg" />
  }

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
            ${(balance || 0).toLocaleString()} <span className="text-base text-slate-500">MXN</span>
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

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="rounded-2xl border border-white/10 bg-slate-900 p-6 lg:col-span-2">
          <h2 className="mb-4 text-lg font-bold text-white">Solicitar Retiro</h2>

          {error && (
            <div className="mb-4 rounded-xl bg-red-400/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Correo PayPal destino"
              type="email"
              placeholder="micuenta@paypal.com"
              value={paypalEmail}
              onChange={(e) => { setPaypalEmail(e.target.value); setFormErrors({}) }}
              error={formErrors.paypalEmail}
            />

            <Input
              label="Monto a retirar (MXN)"
              type="number"
              min={10}
              max={balance}
              placeholder={`Máx. $${(balance || 0).toLocaleString()}`}
              value={amount}
              onChange={(e) => { setAmount(e.target.value); setFormErrors({}) }}
              error={formErrors.amount}
            />

            <Button
              type="submit"
              loading={submitting}
              disabled={!balance || balance <= 0}
              className="w-full"
            >
              Solicitar Transferencia
            </Button>
          </form>

          <p className="mt-4 text-xs text-slate-500">
            Los retiros se procesan en un plazo de 1-3 días hábiles.
            El estado cambiará de <strong>pendiente</strong> a <strong>procesado_payout</strong>.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-900 p-6 lg:col-span-3">
          <h2 className="mb-4 text-lg font-bold text-white">Historial de Retiros</h2>

          {withdrawals.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-500">No has solicitado retiros aún</p>
          ) : (
            <div className="space-y-3">
              {withdrawals.map((w) => {
                const status = WITHDRAWAL_STATUS[w.estado] || {}
                return (
                  <div key={w.id} className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-white">${(w.monto || 0).toLocaleString()} MXN</p>
                      <p className="text-xs text-slate-400">{w.correo_paypal_destino}</p>
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
