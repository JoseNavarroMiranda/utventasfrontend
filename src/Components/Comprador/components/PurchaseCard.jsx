import { Link } from 'react-router'
import OrderStatusBadge from './OrderStatusBadge'

function PurchaseCard({ purchase }) {
  return (
    <Link
      to={`/comprador/compras/${purchase.id}`}
      className="block rounded-2xl border border-white/10 bg-slate-900 p-5 transition hover:border-blue-400/30 hover:bg-slate-800/80"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold text-white truncate">
            {purchase.producto?.titulo || 'Producto'}
          </h3>
          <p className="mt-1 text-sm text-slate-400">
            {purchase.vendedor?.nombre || 'Vendedor'} · ${(purchase.monto || 0).toLocaleString()} MXN
          </p>
        </div>
        <OrderStatusBadge estado={purchase.estado} />
      </div>

      <div className="mt-3 flex items-center gap-4 text-xs text-slate-500">
        <span>{purchase.producto?.categoria}</span>
        <span>{new Date(purchase.created_at).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
      </div>
    </Link>
  )
}

export default PurchaseCard
