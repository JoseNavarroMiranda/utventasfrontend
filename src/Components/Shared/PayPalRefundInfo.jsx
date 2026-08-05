import Badge from './Badge'
import { PAYPAL_SANDBOX_DASHBOARD_URL } from '../../constants'

function PayPalRefundInfo({ transactionId, status, metodo }) {
  return (
    <div className="rounded-xl border border-indigo-400/20 bg-indigo-500/5 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Reembolso PayPal Sandbox
          </span>
          <Badge color="emerald">Validado</Badge>
        </div>
        <a
          href={PAYPAL_SANDBOX_DASHBOARD_URL}
          target="_blank"
          rel="noreferrer"
          className="text-xs font-medium text-indigo-300 underline transition hover:text-indigo-200"
        >
          Ver en el dashboard de PayPal Sandbox ↗
        </a>
      </div>
      <div className="mt-3 grid gap-x-6 gap-y-1.5 text-sm sm:grid-cols-3">
        <p className="text-slate-300">
          Transacción: <span className="font-mono text-xs text-white">{transactionId || '—'}</span>
        </p>
        <p className="text-slate-300">
          Operación: <span className="font-medium text-white">{metodo === 'void' ? 'Void (devolución escrow)' : 'Refund (reembolso)'}</span>
        </p>
        <p className="text-slate-300">
          Estado PayPal: <span className="font-mono font-semibold text-emerald-300">{status || 'CONFIRMADO'}</span>
        </p>
      </div>
    </div>
  )
}

export default PayPalRefundInfo