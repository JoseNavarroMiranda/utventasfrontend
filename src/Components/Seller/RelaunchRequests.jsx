import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchSuspendedProducts, submitRelaunchRequest, uploadRelaunchImage } from '../../store/slices/relaunchSlice'
import LoadingSpinner from '../Shared/LoadingSpinner'
import EmptyState from '../Shared/EmptyState'
import Badge from '../Shared/Badge'
import Button from '../Shared/Button'

const STATUS = {
  pendiente: { label: 'En revisión', color: 'yellow' },
  aprobada: { label: 'Aprobada', color: 'emerald' },
  rechazada: { label: 'Rechazada', color: 'red' },
}

function RequestForm({ product, onDone }) {
  const dispatch = useDispatch()
  const { submitting } = useSelector((s) => s.relaunch)
  const [descripcion, setDescripcion] = useState('')
  const [imagenes, setImagenes] = useState([])
  const [previews, setPreviews] = useState([])
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const handleImages = async (e) => {
    const files = Array.from(e.target.files)
    setUploading(true)
    setError('')
    try {
      const uploaded = []
      const pre = []
      for (const file of files) {
        const url = await dispatch(uploadRelaunchImage(file)).unwrap()
        uploaded.push({ url, es_principal: uploaded.length === 0 })
        pre.push({ url, file })
      }
      setImagenes((prev) => [...prev, ...uploaded])
      setPreviews((prev) => [...prev, ...pre])
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Error al subir las imágenes')
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (idx) => {
    const target = previews[idx]
    setPreviews((prev) => prev.filter((_, i) => i !== idx))
    setImagenes((prev) =>
      prev.filter((img) => img.url !== target.url)
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!descripcion.trim()) {
      setError('Escribe una descripción para tu solicitud')
      return
    }
    setError('')
    const res = await dispatch(
      submitRelaunchRequest({ producto_id: product.id, descripcion: descripcion.trim(), imagenes })
    )
    if (res.meta.requestStatus === 'fulfilled') {
      setDescripcion('')
      setImagenes([])
      setPreviews([])
      onDone()
    } else {
      setError(res.payload || 'No se pudo enviar la solicitud')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-4 rounded-xl bg-slate-950/50 p-4">
      <div>
        <span className="mb-1.5 block text-sm font-medium text-slate-200">
          ¿Por qué quieres volver a publicar este artículo?
        </span>
        <textarea
          rows={3}
          placeholder="Explica el motivo (ej. el comprador no acudió, se resolvió el conflicto, etc.)"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
        />
      </div>

      <div>
        <span className="mb-1.5 block text-sm font-medium text-slate-200">
          Evidencias (imágenes)
        </span>
        <div className="flex flex-wrap gap-3">
          {previews.map((p, idx) => (
            <div key={idx} className="group relative h-24 w-24 overflow-hidden rounded-xl border border-white/10">
              <img src={p.url} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition group-hover:opacity-100"
              >
                <span className="text-2xl text-white">&times;</span>
              </button>
            </div>
          ))}
          {previews.length < 5 && (
            <label className="flex h-24 w-24 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-white/20 text-2xl text-slate-500 transition hover:border-white/40 hover:text-white">
              {uploading ? <span className="text-xs text-slate-400">Subiendo...</span> : <span>+</span>}
              <input type="file" accept="image/*" multiple onChange={handleImages} disabled={uploading} className="hidden" />
            </label>
          )}
        </div>
        <p className="mt-1 text-xs text-slate-500">Máximo 5 imágenes. Formatos: JPG, PNG, WEBP</p>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="flex items-center gap-3">
        <Button type="submit" size="sm" loading={submitting}>
          Solicitar relanzamiento
        </Button>
      </div>
    </form>
  )
}

function RelaunchRequests() {
  const dispatch = useDispatch()
  const { products, loading, error } = useSelector((s) => s.relaunch)
  const [expanded, setExpanded] = useState(null)

  useEffect(() => {
    dispatch(fetchSuspendedProducts())
  }, [dispatch])

  if (loading) return <LoadingSpinner className="py-20" size="lg" />
  if (error) return <p className="py-20 text-center text-red-400">{error}</p>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Solicitudes de Relanzamiento</h1>
        <p className="mt-1 text-sm text-slate-400">
          Si una de tus publicaciones quedó suspendida (por el administrador o tras un reembolso), aquí puedes
          pedir que vuelva a estar en línea para que otro comprador pueda adquirirla. Un administrador revisará tu solicitud.
        </p>
      </div>

      {products.length === 0 ? (
        <EmptyState
          icon="✅"
          title="Sin publicaciones suspendidas"
          description="No tienes publicaciones suspendidas. Todas tus publicaciones están disponibles o vendidas."
        />
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {products.map((product) => {
            const solicitud = product.solicitud
            const status = solicitud ? STATUS[solicitud.estado] : null
            return (
              <div key={product.id} className="rounded-2xl border border-white/10 bg-slate-900 p-5">
                <div className="flex gap-4">
                  {product.imagen ? (
                    <img
                      src={product.imagen}
                      alt={product.titulo}
                      className="h-24 w-24 shrink-0 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl bg-slate-800/60">
                      <span className="text-xs text-slate-500">Sin imagen</span>
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-white">{product.titulo}</h3>
                      <Badge color="red">Suspendida</Badge>
                    </div>
                    <p className="mt-1 text-xs text-slate-400">
                      {product.categoria || 'Sin categoría'} · ${(product.precio || 0).toLocaleString()} MXN
                    </p>
                    {product.motivo_suspension && (
                      <p className="mt-2 rounded-lg border border-orange-400/20 bg-orange-500/10 px-3 py-2 text-xs text-orange-200">
                        <span className="font-semibold">Motivo de la suspensión:</span>{' '}
                        {product.motivo_suspension}
                      </p>
                    )}
                    {status ? (
                      <p className="mt-2 text-xs">
                        <Badge color={status.color}>{status.label}</Badge>
                      </p>
                    ) : (
                      <p className="mt-2 text-xs text-slate-500">Sin solicitud enviada</p>
                    )}
                  </div>
                </div>

                {solicitud ? (
                  <div className="mt-4 rounded-xl bg-slate-950/50 p-4 text-sm">
                    <p className="font-medium text-slate-200">Última solicitud</p>
                    <p className="mt-1 text-slate-300">{solicitud.descripcion}</p>
                    {solicitud.imagenes?.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {solicitud.imagenes.map((img, i) => (
                          <img key={i} src={img} alt="" className="h-16 w-16 rounded-lg object-cover" />
                        ))}
                      </div>
                    )}
                    {solicitud.resolucion_texto && (
                      <p className="mt-2 rounded-lg bg-slate-900 px-3 py-2 text-xs italic text-slate-400">
                        Respuesta del admin: {solicitud.resolucion_texto}
                      </p>
                    )}
                    {solicitud.fecha_solicitud && (
                      <p className="mt-2 text-xs text-slate-500">
                        Enviada el {new Date(solicitud.fecha_solicitud).toLocaleDateString('es-MX')}
                      </p>
                    )}
                  </div>
                ) : null}

                {(!solicitud || solicitud.estado === 'rechazada') && (
                  <div className="mt-4">
                    <button
                      onClick={() => setExpanded(expanded === product.id ? null : product.id)}
                      className="text-sm font-medium text-cyan-400 hover:text-cyan-300"
                    >
                      {expanded === product.id ? 'Cerrar formulario' : 'Solicitar volver a publicar'}
                    </button>
                    {expanded === product.id && (
                      <RequestForm product={product} onDone={() => setExpanded(null)} />
                    )}
                  </div>
                )}
              </div>
            )
          }          )}
        </div>
      )}
    </div>
  )
}

export default RelaunchRequests