import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchSales, validateToken, clearSaleError } from '../../store/slices/saleSlice'
import { createWithdrawal, fetchMyWithdrawals } from '../../store/slices/withdrawalSlice'
import { ORDER_STATUS } from '../../constants'
import LoadingSpinner from '../Shared/LoadingSpinner'
import EmptyState from '../Shared/EmptyState'
import Badge from '../Shared/Badge'
import Button from '../Shared/Button'
import Modal from '../Shared/Modal'

function WithdrawalModal({ sale, onClose }) {
  const dispatch = useDispatch()
  const [correo, setCorreo] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!correo.trim()) { setError('El correo PayPal es obligatorio'); return }
    setError('')
    setLoading(true)
    const result = await dispatch(createWithdrawal({ correo_paypal_destino: correo.trim(), pedido_id: sale.id }))
    setLoading(false)
    if (result.meta.requestStatus === 'fulfilled') {
      onClose()
    } else {
      setError(result.payload || 'Error al solicitar retiro')
    }
  }

  return (
    <Modal isOpen onClose={onClose} title="Solicitar Retiro" size="sm">
      <p className="mb-4 text-sm text-slate-300">
        Retirar <strong className="text-white">${(sale.monto || 0).toLocaleString()} MXN</strong> de la venta:
      </p>
      <p className="mb-4 text-xs text-slate-500">
        {sale.producto?.titulo || 'Producto'} — {sale.comprador?.nombre || 'Comprador'}
      </p>

      <div className="space-y-4">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-100">Correo PayPal</span>
          <input
            type="email"
            placeholder="correo@paypal.com"
            value={correo}
            onChange={(e) => { setCorreo(e.target.value); setError('') }}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
            autoFocus
          />
        </label>
      </div>

      {error && <p className="mt-3 text-xs text-red-400">{error}</p>}

      <div className="mt-6 flex justify-end gap-3">
        <Button variant="ghost" onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSubmit} loading={loading}>Solicitar Retiro</Button>
      </div>
    </Modal>
  )
}

function TokenModal({ sale, onClose }) {
  const dispatch = useDispatch()
  const [token, setToken] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!token.trim()) {
      setError('Ingresa el token de entrega')
      return
    }
    setError('')
    const result = await dispatch(validateToken({ saleId: sale.id, token_entrega: token.trim() }))
    if (result.meta.requestStatus === 'fulfilled') {
      onClose()
    } else {
      setError(result.payload || 'Token inválido')
    }
  }

  return (
    <Modal isOpen onClose={onClose} title="Validar Token de Entrega" size="sm">
      <p className="mb-2 text-sm text-slate-300">
        Ingresa el token que <strong className="text-white">{sale.comprador?.nombre || 'el comprador'}</strong> te proporcionó físicamente en la universidad.
      </p>
      <p className="mb-4 text-xs text-slate-500">
        Producto: {sale.producto?.titulo || '—'} • Monto: ${(sale.monto || 0).toLocaleString()} MXN
      </p>

      <input
        type="text"
        placeholder="Ej. ABC123XYZ"
        value={token}
        onChange={(e) => { setToken(e.target.value); setError('') }}
        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
        autoFocus
      />
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}

      <div className="mt-6 flex justify-end gap-3">
        <Button variant="ghost" onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSubmit}>Validar y Completar</Button>
      </div>
    </Modal>
  )
}

function SalesList() {
  const dispatch = useDispatch()
  const { items: sales, loading, error } = useSelector((s) => s.sales)
  const { items: withdrawals } = useSelector((s) => s.withdrawals)
  const [tokenSale, setTokenSale] = useState(null)
  const [withdrawalSale, setWithdrawalSale] = useState(null)

  const hasWithdrawal = (saleId) => withdrawals.some((w) => w.pedido_id === saleId)

  useEffect(() => {
    dispatch(fetchSales())
    dispatch(fetchMyWithdrawals())
  }, [dispatch])

  const needToken = (sale) => sale.estado === 'paid_escrow'

  if (loading) return <LoadingSpinner className="py-20" size="lg" />
  if (error) return <p className="py-20 text-center text-red-400">{error}</p>

  if (sales.length === 0) {
    return (
      <EmptyState
        title="No hay ventas registradas"
        description="Cuando un comprador adquiera uno de tus productos, aparecerá aquí."
      />
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Mis Ventas</h1>
        <p className="mt-1 text-sm text-slate-400">
          {sales.filter((s) => s.estado === 'paid_escrow').length} ventas pendientes de validación
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-800/50">
            <tr>
              <th className="px-4 py-3 font-medium text-slate-300">Producto</th>
              <th className="px-4 py-3 font-medium text-slate-300">Comprador</th>
              <th className="px-4 py-3 font-medium text-slate-300">Monto</th>
              <th className="px-4 py-3 font-medium text-slate-300">Estado</th>
              <th className="px-4 py-3 text-right font-medium text-slate-300">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {sales.map((sale) => {
              const status = ORDER_STATUS[sale.estado] || {}
              return (
                <tr key={sale.id} className="transition hover:bg-white/[0.02]">
                  <td className="px-4 py-3">
                    <p className="font-medium text-white">{sale.producto?.titulo || '—'}</p>
                    <p className="text-xs text-slate-500">#{sale.id}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-300">
                    {sale.comprador?.nombre || 'Comprador'}
                    <p className="text-xs text-slate-500">{sale.comprador?.email || ''}</p>
                  </td>
                  <td className="px-4 py-3 font-medium text-white">
                    ${(sale.monto || 0).toLocaleString()} MXN
                  </td>
                  <td className="px-4 py-3">
                    <Badge color={status.color}>
                      {status.label || sale.estado}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {needToken(sale) ? (
                      <Button size="sm" onClick={() => setTokenSale(sale)}>
                        Validar Token
                      </Button>
                    ) : sale.estado === 'delivered_completed' ? (
                      hasWithdrawal(sale.id) ? (
                        <span className="text-xs text-slate-500">Retirado</span>
                      ) : (
                        <Button size="sm" onClick={() => setWithdrawalSale(sale)}>
                          Retirar
                        </Button>
                      )
                    ) : null}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {tokenSale && (
        <TokenModal
          sale={tokenSale}
          onClose={() => { setTokenSale(null); dispatch(clearSaleError()) }}
        />
      )}

      {withdrawalSale && (
        <WithdrawalModal
          sale={withdrawalSale}
          onClose={() => setWithdrawalSale(null)}
        />
      )}
    </div>
  )
}

export default SalesList
