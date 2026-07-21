import { useState } from 'react'
import Button from '../../Shared/Button'
import { ORDER_STATUS } from '../../../constants'

const DISPUTE_REASONS = [
  { value: 'producto_no_coincide', label: 'El producto no coincide con la descripción' },
  { value: 'vendedor_no_se_presento', label: 'El vendedor no se presentó' },
  { value: 'producto_defectuoso', label: 'El producto está defectuoso' },
  { value: 'otro', label: 'Otro motivo' },
]

function DisputeForm({ purchase, onSubmit, submitting }) {
  const [motivo, setMotivo] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!motivo) { setError('Selecciona un motivo'); return }
    if (!descripcion.trim()) { setError('Describe el problema'); return }
    setError('')
    onSubmit({ motivo, descripcion: descripcion.trim() })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-100">Motivo de la disputa</label>
        <select
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-3 text-sm text-white outline-none transition focus:border-orange-400/50 focus:ring-1 focus:ring-orange-400/20"
        >
          <option value="">Selecciona un motivo</option>
          {DISPUTE_REASONS.map((r) => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-100">Descripción detallada</label>
        <textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          rows={4}
          placeholder="Explica qué sucedió con tu pedido..."
          className="w-full resize-none rounded-xl border border-white/10 bg-slate-800 px-4 py-3 text-sm text-white placeholder-slate-400 outline-none transition focus:border-orange-400/50 focus:ring-1 focus:ring-orange-400/20"
        />
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      {purchase && (
        <div className="rounded-xl border border-white/10 bg-slate-800/50 p-4">
          <p className="text-xs text-slate-400">Pedido relacionado</p>
          <p className="mt-1 text-sm font-medium text-white">{purchase.producto?.titulo}</p>
          <p className="text-xs text-slate-400">
            {purchase.vendedor?.nombre} · ${(purchase.monto || 0).toLocaleString()} MXN ·{' '}
            {ORDER_STATUS[purchase.estado]?.label || purchase.estado}
          </p>
        </div>
      )}

      <Button type="submit" variant="danger" loading={submitting} className="w-full">
        Reportar Incidencia
      </Button>
    </form>
  )
}

export default DisputeForm
