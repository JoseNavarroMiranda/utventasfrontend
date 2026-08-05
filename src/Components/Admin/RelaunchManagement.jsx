import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchRelaunchRequests, reviewRelaunchRequest } from '../../store/slices/adminSlice'
import { Table, Td } from '../Shared/Table'
import Badge from '../Shared/Badge'
import Button from '../Shared/Button'
import Modal from '../Shared/Modal'
import EmptyState from '../Shared/EmptyState'

const REQUEST_STATUS = {
  pendiente: { label: 'Pendiente', color: 'yellow' },
  aprobada: { label: 'Aprobada', color: 'emerald' },
  rechazada: { label: 'Rechazada', color: 'red' },
}

function RelaunchManagement() {
  const dispatch = useDispatch()
  const { relaunchRequests } = useSelector((s) => s.admin)
  const [selected, setSelected] = useState(null)
  const [resolucion, setResolucion] = useState('')
  const [resolucionRequired, setResolucionRequired] = useState(false)
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    dispatch(fetchRelaunchRequests())
  }, [dispatch])

  const openDetail = (req) => {
    setSelected(req)
    setResolucion('')
    setResolucionRequired(false)
  }

  const handleReview = async (aprobada) => {
    if (!resolucion.trim()) {
      setResolucionRequired(true)
      return
    }
    setProcessing(true)
    const res = await dispatch(
      reviewRelaunchRequest({ id: selected.id, aprobada, resolucion_texto: resolucion.trim() })
    )
    setProcessing(false)
    if (res.meta.requestStatus === 'fulfilled') {
      setSelected(null)
      dispatch(fetchRelaunchRequests())
    } else {
      setResolucionRequired(true)
    }
  }

  const pendientes = relaunchRequests.filter((r) => r.estado === 'pendiente')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Solicitudes de Relanzamiento</h1>
        <p className="mt-1 text-sm text-slate-400">
          {pendientes.length} solicitudes pendientes para volver a publicar un artículo tras un reembolso
        </p>
      </div>

      {relaunchRequests.length === 0 ? (
        <EmptyState
          icon="📦"
          title="Sin solicitudes"
          description="Aún no hay vendedores pidiendo relanzar sus publicaciones suspendidas."
        />
      ) : (
        <Table
          headers={[
            { label: 'Producto' },
            { label: 'Vendedor' },
            { label: 'Solicitud' },
            { label: 'Estado' },
            { label: 'Fecha' },
            { label: 'Accion', right: true },
          ]}
        >
          {relaunchRequests.map((r) => {
            const status = REQUEST_STATUS[r.estado] || REQUEST_STATUS.pendiente
            return (
              <tr key={r.id} className="transition hover:bg-white/[0.02]">
                <Td>
                  <p className="font-medium text-white">{r.producto?.titulo || '—'}</p>
                  <p className="text-xs text-slate-500">#{r.producto_id}</p>
                </Td>
                <Td className="text-slate-300">{r.vendedor?.nombre || '—'}</Td>
                <Td className="max-w-[220px]">
                  <p className="truncate text-slate-300">{r.descripcion}</p>
                  {r.imagenes.length > 0 && (
                    <p className="text-xs text-slate-500">{r.imagenes.length} imagen(es) adjunta(s)</p>
                  )}
                </Td>
                <Td><Badge color={status.color}>{status.label}</Badge></Td>
                <Td className="text-xs text-slate-400">
                  {new Date(r.fecha_solicitud).toLocaleDateString('es-MX')}
                </Td>
                <Td right>
                  {r.estado === 'pendiente' && (
                    <Button size="sm" onClick={() => openDetail(r)}>Revisar</Button>
                  )}
                </Td>
              </tr>
            )
          })}
        </Table>
      )}

      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title={`Solicitud de relanzamiento #${selected?.id}`} size="lg">
        {selected && (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <p className="text-xs text-slate-500">Producto</p>
                <p className="text-sm font-medium text-white">{selected.producto?.titulo}</p>
                <p className="text-xs text-slate-400">
                  {selected.producto?.categoria && `Categoría: ${selected.producto.categoria}`}
                </p>
                <p className="text-xs text-slate-400">
                  Precio: ${(selected.producto?.precio || 0).toLocaleString()} MXN
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Vendedor</p>
                <p className="text-sm text-white">{selected.vendedor?.nombre}</p>
                <p className="text-xs text-slate-400">{selected.vendedor?.email}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Estado</p>
                <p className="text-sm">
                  <Badge color="red">Publicación suspendida</Badge>
                </p>
              </div>
            </div>

            {selected.producto?.imagen && (
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-400">Publicación actual</p>
                <img
                  src={selected.producto.imagen}
                  alt={selected.producto.titulo}
                  className="h-40 w-full rounded-xl object-cover sm:w-64"
                />
              </div>
            )}

            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-400">Descripción del vendedor</p>
              <div className="rounded-xl bg-slate-950/50 p-4">
                <p className="text-sm leading-relaxed text-slate-300">"{selected.descripcion}"</p>
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-400">
                Imágenes adjuntas ({selected.imagenes.length})
              </p>
              {selected.imagenes.length > 0 ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {selected.imagenes.map((img, i) => (
                    <a key={i} href={img} target="_blank" rel="noreferrer">
                      <img
                        src={img}
                        alt={`Evidencia ${i + 1}`}
                        className="h-32 w-full rounded-xl object-cover border border-white/10 transition hover:border-cyan-400/50"
                      />
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-xs italic text-slate-500">El vendedor no adjuntó imágenes.</p>
              )}
            </div>

            <div>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-slate-100">Resolución (requerido)</span>
                <textarea
                  rows={3}
                  placeholder="Escribe tu decisión y observaciones..."
                  value={resolucion}
                  onChange={(e) => { setResolucion(e.target.value); setResolucionRequired(false) }}
                  className={`w-full rounded-xl border bg-white/5 px-4 py-3 text-white outline-none transition focus:ring-2 ${
                    resolucionRequired ? 'border-red-400 focus:ring-red-200' : 'border-white/10 focus:border-cyan-400 focus:ring-cyan-400/20'
                  }`}
                />
                {resolucionRequired && <p className="mt-1 text-xs text-red-400">La resolución es obligatoria</p>}
              </label>
            </div>

            <div className="flex flex-col gap-3 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-end">
              <Button
                variant="danger"
                loading={processing}
                onClick={() => handleReview(false)}
              >
                Rechazar (sigue suspendida)
              </Button>
              <Button
                variant="primary"
                loading={processing}
                onClick={() => handleReview(true)}
              >
                Aprobar y volver a publicar
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default RelaunchManagement