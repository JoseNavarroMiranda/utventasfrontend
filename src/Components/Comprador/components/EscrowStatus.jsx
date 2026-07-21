function EscrowStatus({ estado, monto }) {
  const isPaid = estado === 'paid_escrow'
  const isPending = estado === 'pending'

  return (
    <div className={`rounded-xl border p-4 ${
      isPaid
        ? 'border-emerald-400/30 bg-emerald-400/5'
        : isPending
          ? 'border-yellow-400/30 bg-yellow-400/5'
          : 'border-white/10 bg-white/5'
    }`}>
      <p className="text-xs text-slate-400">Estado del pago</p>
      <div className="mt-1 flex items-center gap-2">
        <span className={`inline-block h-2.5 w-2.5 rounded-full ${
          isPaid ? 'bg-emerald-400' : isPending ? 'bg-yellow-400' : 'bg-slate-500'
        }`} />
        <span className="text-sm font-medium text-white">
          {isPaid ? 'Pagado (Escrow)' : isPending ? 'Pendiente de pago' : '—'}
        </span>
      </div>
      {isPaid && (
        <p className="mt-1 text-xs text-emerald-300">
          ${(monto || 0).toLocaleString()} MXN retenidos en Escrow
        </p>
      )}
      {isPending && (
        <p className="mt-1 text-xs text-yellow-300">
          El pago se liberará al vendedor cuando confirmes la entrega
        </p>
      )}
    </div>
  )
}

export default EscrowStatus
