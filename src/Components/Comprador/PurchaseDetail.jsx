import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, Link } from 'react-router'
import { fetchPurchaseDetail, clearCurrentPurchase } from '../../store/slices/buyerSlice'
import LoadingSpinner from '../Shared/LoadingSpinner'
import Button from '../Shared/Button'
import OrderStatusBadge from './components/OrderStatusBadge'
import EscrowStatus from './components/EscrowStatus'
import DeliveryToken from './components/DeliveryToken'
import { ORDER_STATUS } from '../../constants'

function DetailRow({ label, value }) {
  return (
    <div className="flex justify-between border-b border-white/5 py-3">
      <span className="text-sm text-slate-400">{label}</span>
      <span className="text-sm font-medium text-white text-right">{value || '—'}</span>
    </div>
  )
}

function PurchaseDetail() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { currentPurchase: purchase, loading, error } = useSelector((s) => s.buyer)

  useEffect(() => {
    dispatch(fetchPurchaseDetail(Number(id)))
    return () => { dispatch(clearCurrentPurchase()) }
  }, [dispatch, id])

  if (loading) return <LoadingSpinner className="py-20" size="lg" />
  if (error) return <p className="py-20 text-center text-red-400">{error}</p>
  if (!purchase) return <p className="py-20 text-center text-slate-400">Pedido no encontrado</p>

  const canOpenDispute = ['pending', 'paid_escrow'].includes(purchase.estado)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          to="/comprador/compras"
          className="rounded-lg p-2 text-slate-400 transition hover:bg-white/5 hover:text-white"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">{purchase.producto?.titulo || 'Detalle del Pedido'}</h1>
          <p className="mt-1 text-sm text-slate-400">
            Pedido #{purchase.id} · <OrderStatusBadge estado={purchase.estado} />
          </p>
        </div>
      </div>

      {(purchase.estado === 'paid_escrow' || purchase.estado === 'delivered_completed') && (
        <DeliveryToken token={purchase.token_entrega} />
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="rounded-2xl border border-white/10 bg-slate-900 p-6">
            <h2 className="mb-4 text-lg font-bold text-white">Información del Pedido</h2>
            <DetailRow label="Producto" value={purchase.producto?.titulo} />
            <DetailRow label="Categoría" value={purchase.producto?.categoria} />
            <DetailRow label="Monto" value={`$${(purchase.monto || 0).toLocaleString()} MXN`} />
            <DetailRow label="Estado" value={ORDER_STATUS[purchase.estado]?.label || purchase.estado} />
            <DetailRow label="Fecha" value={new Date(purchase.created_at).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })} />
            <DetailRow label="Método de contacto" value={purchase.metodo_contacto} />
          </div>

          {purchase.notas && (
            <div className="rounded-2xl border border-white/10 bg-slate-900 p-6">
              <h2 className="mb-2 text-lg font-bold text-white">Notas</h2>
              <p className="text-sm text-slate-300">{purchase.notas}</p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-white/10 bg-slate-900 p-6">
            <h2 className="mb-4 text-lg font-bold text-white">Vendedor</h2>
            <DetailRow label="Nombre" value={purchase.vendedor?.nombre} />
            <DetailRow label="Email" value={purchase.vendedor?.email} />
            <DetailRow label="Teléfono" value={purchase.vendedor?.telefono} />
          </div>

          <EscrowStatus estado={purchase.estado} monto={purchase.monto} />

          {canOpenDispute && (
            <Link to="/comprador/disputas" state={{ purchase }}>
              <Button variant="danger" className="w-full">
                Reportar incidencia
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default PurchaseDetail
