import { useState } from 'react'
import Button from '../../Shared/Button'
import { ORDER_STATUS } from '../../../constants'
import { api } from '../../../services/api'

const DISPUTE_REASONS = [
  { value: 'producto_no_coincide', label: 'El producto no coincide con la descripción' },
  { value: 'vendedor_no_se_presento', label: 'El vendedor no se presentó' },
  { value: 'producto_defectuoso', label: 'El producto está defectuoso' },
  { value: 'otro', label: 'Otro motivo' },
]

const MAX_IMAGES = 5

function DisputeForm({ purchase, onSubmit, submitting }) {
  const [motivo, setMotivo] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [imagenes, setImagenes] = useState([])
  const [previews, setPreviews] = useState([])
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const handleImages = async (e) => {
    const files = Array.from(e.target.files).slice(0, MAX_IMAGES - imagenes.length)
    if (files.length === 0) return
    setUploading(true)
    setError('')
    try {
      const uploaded = []
      const pre = []
      for (const file of files) {
        const fd = new FormData()
        fd.append('imagen', file)
        const res = await api.upload('/api/comprador/subir-imagen', fd)
        uploaded.push({ url: res.url, es_principal: uploaded.length === 0 && imagenes.length === 0 })
        pre.push({ url: res.url, file })
      }
      setImagenes((prev) => [...prev, ...uploaded])
      setPreviews((prev) => [...prev, ...pre])
    } catch {
      setError('Error al subir las imágenes. Intenta de nuevo.')
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (idx) => {
    const target = previews[idx]
    setPreviews((prev) => prev.filter((_, i) => i !== idx))
    setImagenes((prev) => prev.filter((img) => img.url !== target.url))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!motivo) { setError('Selecciona un motivo'); return }
    if (!descripcion.trim()) { setError('Describe el problema'); return }
    if (imagenes.length === 0) { setError('Adjunta al menos una imagen como evidencia'); return }
    if (uploading) { setError('Espera a que terminen de subirse las imágenes'); return }
    setError('')
    onSubmit({ motivo, descripcion: descripcion.trim(), imagenes })
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

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-100">
          Evidencias <span className="text-orange-400">*</span>
        </label>
        <p className="mb-2 text-xs text-slate-400">
          Adjunta fotos del producto o de lo sucedido para agilizar la validación. Obligatorio.
        </p>
        <div className="flex flex-wrap gap-3">
          {previews.map((p, idx) => (
            <div key={idx} className="group relative h-20 w-20 overflow-hidden rounded-xl border border-white/10 sm:h-24 sm:w-24">
              <img src={p.url} alt={`Evidencia ${idx + 1}`} className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition group-hover:opacity-100"
              >
                <span className="text-2xl text-white">&times;</span>
              </button>
            </div>
          ))}
          {previews.length < MAX_IMAGES && (
            <label className="flex h-20 w-20 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-white/20 text-2xl text-slate-500 transition hover:border-white/40 hover:text-white sm:h-24 sm:w-24">
              {uploading ? <span className="px-1 text-center text-xs text-slate-400">Subiendo...</span> : <span>+</span>}
              <input type="file" accept="image/*" multiple onChange={handleImages} disabled={uploading} className="hidden" />
            </label>
          )}
        </div>
        <p className="mt-1 text-xs text-slate-500">Máximo {MAX_IMAGES} fotos · JPG, PNG, WEBP · toma desde tu cámara o galería</p>
      </div>

      {error && (
        <p className="rounded-xl bg-red-400/10 px-4 py-3 text-sm text-red-300">{error}</p>
      )}

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