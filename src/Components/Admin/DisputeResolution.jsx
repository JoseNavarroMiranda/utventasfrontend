import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchDisputes, resolveDispute } from '../../store/slices/adminSlice'
import { Table, Td } from '../Shared/Table'
import Badge from '../Shared/Badge'
import Button from '../Shared/Button'
import Modal from '../Shared/Modal'
import PayPalRefundInfo from '../Shared/PayPalRefundInfo'

const DISPUTE_REASON_LABELS = {
  producto_no_coincide: 'El producto no coincide con la descripción',
  vendedor_no_se_presento: 'El vendedor no se presentó',
  producto_defectuoso: 'El producto está defectuoso',
  otro: 'Otro motivo',
}

function Timeline({ events }) {
  return (
    <div className="space-y-3">
      {events.map((ev, i) => (
        <div key={i} className="relative pl-6 before:absolute before:left-2 before:top-2 before:h-2 before:w-2 before:rounded-full before:bg-cyan-400 before:content-['']">
          {i < events.length - 1 && (
            <div className="absolute bottom-0 left-[11px] top-4 w-px bg-white/10" />
          )}
          <p className="text-sm font-medium text-white">{ev.accion}</p>
          <p className="text-xs text-slate-400">
            {ev.usuario} - {new Date(ev.fecha).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </p>
          {ev.notas && (
            <p className="mt-1 text-xs text-slate-500 italic">{ev.notas}</p>
          )}
        </div>
      ))}
    </div>
  )
}

function DisputeResolution() {
  const dispatch = useDispatch()
  const { disputes } = useSelector((s) => s.admin)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    dispatch(fetchDisputes())
  }, [dispatch])
  const [note, setNote] = useState('')
  const [noteRequired, setNoteRequired] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [feedback, setFeedback] = useState(null)
  const [resolved, setResolved] = useState(null)

  const openDetail = (dispute) => {
    setSelected(dispute)
    setNote('')
    setNoteRequired(false)
    setFeedback(null)
    setResolved(null)
  }

  const handleResolve = async (estado) => {
    if (!note.trim()) {
      setNoteRequired(true)
      return
    }
    const caso = selected
    setSubmitting(true)
    setFeedback(null)
    const res = await dispatch(
      resolveDispute({ id: caso.id, estado, notas_auditoria: note.trim() })
    )
    setSubmitting(false)
    if (res.meta.requestStatus === 'fulfilled') {
      const paypal = res.payload?.paypal || null
      const msg =
        estado === 'REEMBOLSO'
          ? 'Reembolso al comprador realizado y VALIDADO en PayPal Sandbox. El pedido fue cancelado y la publicación quedó suspendida.'
          : 'Fondos liberados al vendedor. El pedido se marcó como completado.'
      setFeedback({
        type: 'success',
        msg,
      })
      setResolved({ estado, msg, paypal })
    } else {
      setFeedback({
        type: 'error',
        msg: res.error?.message || 'No se pudo resolver la disputa. Intenta de nuevo.',
      })
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Resolucion de Disputas</h1>
        <p className="mt-1 text-sm text-slate-400">{disputes.length} disputas activas pendientes de revision</p>
      </div>

      {feedback && (
        <div
          className={`flex items-start justify-between gap-3 rounded-xl border px-4 py-3 text-sm ${
            feedback.type === 'success'
              ? 'border-emerald-400/30 bg-emerald-500/10 text-emerald-300'
              : 'border-red-400/30 bg-red-500/10 text-red-300'
          }`}
        >
          <p className="font-medium">{feedback.msg}</p>
          <button
            onClick={() => setFeedback(null)}
            className="shrink-0 text-xs opacity-70 transition hover:opacity-100"
            aria-label="Cerrar mensaje"
          >
            ✕
          </button>
        </div>
      )}

      <Table
        headers={[
          { label: 'Pedido' },
          { label: 'Producto' },
          { label: 'Comprador' },
          { label: 'Vendedor' },
          { label: 'Monto' },
          { label: 'Estado' },
          { label: 'Fecha' },
          { label: 'Accion', right: true },
        ]}
      >
        {disputes.map((d) => (
          <tr key={d.id} className="transition hover:bg-white/[0.02]">
            <Td><span className="font-mono text-xs text-cyan-400">#{d.pedido_id}</span></Td>
            <Td><p className="font-medium text-white">{d.producto?.titulo || '—'}</p></Td>
            <Td className="text-slate-300">{d.comprador?.nombre || '—'}</Td>
            <Td className="text-slate-300">{d.vendedor?.nombre || '—'}</Td>
            <Td className="font-medium text-white">${(d.monto || 0).toLocaleString()} MXN</Td>
            <Td><Badge color="red">En Disputa</Badge></Td>
            <Td className="text-xs text-slate-400">
              {new Date(d.created_at).toLocaleDateString('es-MX')}
            </Td>
            <Td right>
              <Button size="sm" onClick={() => openDetail(d)}>Revisar</Button>
            </Td>
          </tr>
        ))}
      </Table>

      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title={`Disputa #${selected?.pedido_id}`} size="lg">
        {selected && (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <p className="text-xs text-slate-500">Producto</p>
                <p className="text-sm font-medium text-white">{selected.producto?.titulo}</p>
                <p className="text-xs text-slate-400">
                  {selected.producto?.categoria && `Categoría: ${selected.producto.categoria}`}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Comprador</p>
                <p className="text-sm text-white">{selected.comprador?.nombre}</p>
                <p className="text-xs text-slate-400">{selected.comprador?.email}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Vendedor</p>
                <p className="text-sm text-white">{selected.vendedor?.nombre}</p>
                <p className="text-xs text-slate-400">{selected.vendedor?.email}</p>
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-400">Reporte del Comprador</p>
              <div className="rounded-xl bg-slate-950/50 p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge color="orange">
                    {DISPUTE_REASON_LABELS[selected.motivo] || selected.motivo || 'Sin motivo'}
                  </Badge>
                  {selected.fecha_apertura && (
                    <span className="text-xs text-slate-500">
                      {new Date(selected.fecha_apertura).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  )}
                </div>
                {selected.descripcion ? (
                  <p className="mt-3 text-sm leading-relaxed text-slate-300">"{selected.descripcion}"</p>
                ) : (
                  <p className="mt-3 text-xs italic text-slate-500">El comprador no agregó una descripción adicional.</p>
                )}
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-400">
                Evidencias del comprador ({selected.evidencias?.length || 0})
              </p>
              {selected.evidencias?.length > 0 ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {selected.evidencias.map((img, i) => (
                    <a key={i} href={img} target="_blank" rel="noreferrer">
                      <img
                        src={img}
                        alt={`Evidencia ${i + 1}`}
                        className="h-28 w-full rounded-lg border border-white/10 object-cover transition hover:border-orange-400/50 sm:h-32"
                      />
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-xs italic text-slate-500">El comprador no adjuntó evidencias.</p>
              )}
            </div>

            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-400">Publicación</p>
              <div className="flex flex-col gap-4 rounded-xl bg-slate-950/50 p-4 sm:flex-row">
                {selected.producto?.imagen ? (
                  <img
                    src={selected.producto.imagen}
                    alt={selected.producto.titulo}
                    className="h-40 w-full rounded-lg object-cover sm:w-40"
                  />
                ) : (
                  <div className="flex h-40 w-full items-center justify-center rounded-lg bg-slate-800/60 sm:w-40">
                    <span className="text-xs text-slate-500">Sin imagen</span>
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-sm font-bold text-white">{selected.producto?.titulo}</h4>
                    {selected.producto?.es_activo === false && (
                      <Badge color="red">Inactivo</Badge>
                    )}
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-slate-300">
                    {selected.producto?.descripcion || 'Sin descripción'}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-400">
                    <span>Precio: <strong className="text-white">${(selected.producto?.precio || 0).toLocaleString()} MXN</strong></span>
                    {selected.producto?.categoria && <span>Categoría: {selected.producto.categoria}</span>}
                    {selected.producto?.fecha_publicacion && (
                      <span>
                        Publicado: {new Date(selected.producto.fecha_publicacion).toLocaleDateString('es-MX')}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-400">Historial del Pedido</p>
              <div className="max-h-60 overflow-y-auto rounded-xl bg-slate-950/50 p-4">
                <Timeline events={selected.historico} />
              </div>
            </div>

            <div>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-slate-100">Notas de auditoria (requerido)</span>
                <textarea
                  rows={3}
                  placeholder="Documenta la resolucion de la disputa..."
                  value={note}
                  onChange={(e) => { setNote(e.target.value); setNoteRequired(false) }}
                  className={`w-full rounded-xl border bg-white/5 px-4 py-3 text-white outline-none transition focus:ring-2 ${
                    noteRequired ? 'border-red-400 focus:ring-red-200' : 'border-white/10 focus:border-cyan-400 focus:ring-cyan-400/20'
                  }`}
                />
                {noteRequired && <p className="mt-1 text-xs text-red-400">Las notas de auditoria son obligatorias</p>}
              </label>
            </div>

                        {feedback && !resolved && feedback.type === 'error' && (
              <div className="flex items-start justify-between gap-3 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                <p className="font-medium">{feedback.msg}</p>
                <button
                  onClick={() => setFeedback(null)}
                  className="shrink-0 text-xs opacity-70 transition hover:opacity-100"
                  aria-label="Cerrar mensaje"
                >
                  ✕
                </button>
              </div>
            )}

            {resolved ? (
              <div className="space-y-4">
                <div className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 p-4">
                  <div className="flex items-start gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-400 text-sm font-bold text-slate-950">
                      ✓
                    </span>
                    <div>
                      <p className="font-semibold text-emerald-300">Disputa resuelta correctamente</p>
                      <p className="mt-1 text-sm text-emerald-200/90">{resolved.msg}</p>
                      <p className="mt-2 text-xs text-emerald-300/70">
                        La disputa ya no aparece en la lista de pendientes. Puedes cerrar esta ventana.
                      </p>
                    </div>
                  </div>
                </div>
                {resolved.estado === 'REEMBOLSO' && (
                  <PayPalRefundInfo
                    transactionId={resolved.paypal?.transaction_id}
                    status={resolved.paypal?.status}
                    metodo={resolved.paypal?.metodo}
                  />
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-3 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-slate-400">
                    Monto en disputa: <strong className="text-white">${selected.monto.toLocaleString()} MXN</strong>
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Al reembolsar al comprador, la publicación quedará suspendida y el vendedor deberá solicitar su relanzamiento.
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button
                    variant="danger"
                    onClick={() => handleResolve('REEMBOLSO')}
                    loading={submitting}
                    disabled={submitting}
                  >
                    {submitting ? 'Procesando...' : 'Reembolsar al Comprador'}
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => handleResolve('PAGO_VENDEDOR')}
                    loading={submitting}
                    disabled={submitting}
                  >
                    {submitting ? 'Procesando...' : 'Liberar al Vendedor'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}

export default DisputeResolution
