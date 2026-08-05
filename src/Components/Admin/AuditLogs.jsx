import { useState, useMemo, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAuditLogs } from '../../store/slices/adminSlice'
import Badge from '../Shared/Badge'
import Input from '../Shared/Input'
import LoadingSpinner from '../Shared/LoadingSpinner'

const ESTADO_LABELS = {
  _null: '—',
  pendiente_pago: 'Pendiente de pago',
  pagado_escrow: 'Pagado (en escrow)',
  en_disputa: 'En disputa',
  entregado_completado: 'Entregado / Completado',
  cancelado_reembolsado: 'Cancelado (reembolsado)',
  cancelado: 'Cancelado',
  solicitud_relanzamiento: 'Solicitud de relanzamiento',
  aprobada: 'Relanzamiento aprobado',
  rechazada: 'Relanzamiento rechazado',
}

function labelEstado(estado) {
  if (!estado) return ESTADO_LABELS._null
  return ESTADO_LABELS[estado] ?? estado
}

function clasificarEvento(log) {
  const n = (log.estado_nuevo || '').toLowerCase()
  const notas = (log.notas || '').toLowerCase()

  if (n === 'en_disputa' || notas.includes('disputa abierta') || notas.includes('se abri') && notas.includes('disputa')) {
    return { tipo: 'Apertura de disputa', color: 'red' }
  }
  if (n === 'entregado_completado' && log.estado_anterior === 'pagado_escrow') {
    return { tipo: 'Venta completada', color: 'emerald' }
  }
  if (n === 'pagado_escrow') {
    return { tipo: 'Compra (fondos al escrow)', color: 'cyan' }
  }
  if (n === 'cancelado_reembolsado') {
    return { tipo: 'Reembolso', color: 'red' }
  }
  if (notas.includes('suspendid')) {
    return { tipo: 'Suspension de publicacion', color: 'orange' }
  }
  if (n === 'solicitud_relanzamiento' || n === 'relanzamiento' || n === 'aprobada' || n === 'rechazada') {
    return { tipo: n === 'aprobada' ? 'Relanzamiento aprobado' : n === 'rechazada' ? 'Relanzamiento rechazado' : 'Solicitud de relanzamiento', color: 'cyan' }
  }
  if (notas.includes('relanzamiento')) {
    return { tipo: 'Relanzamiento', color: 'cyan' }
  }
  if (n === 'pendiente_pago' || n === 'creado') {
    return { tipo: 'Pedido creado', color: 'slate' }
  }
  return { tipo: log.accion || 'Evento registrado', color: 'slate' }
}

function EventoDesglose({ log }) {
  const { tipo, color } = clasificarEvento(log)
  return (
    <div className="mt-3 grid gap-3 sm:grid-cols-2">
      <div className="rounded-lg border border-white/10 bg-slate-950/60 p-3">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Tipo de evento</p>
        <div className="mt-1">
          <Badge color={color}>{tipo}</Badge>
        </div>
      </div>
      <div className="rounded-lg border border-white/10 bg-slate-950/60 p-3">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Transicion de estado</p>
        <div className="mt-1 flex items-center gap-2 text-sm text-slate-300">
          <span>{labelEstado(log.estado_anterior)}</span>
          <span className="text-cyan-400">→</span>
          <span>{labelEstado(log.estado_nuevo)}</span>
        </div>
      </div>
      {log.pedido_monto != null && (
        <div className="rounded-lg border border-white/10 bg-slate-950/60 p-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Monto del pedido</p>
          <p className="mt-1 text-sm font-medium text-white">
            {'$' + Number(log.pedido_monto).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
          </p>
        </div>
      )}
      <div className="rounded-lg border border-white/10 bg-slate-950/60 p-3">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Estado actual del pedido</p>
        <p className="mt-1 text-sm font-medium text-slate-200">{labelEstado(log.pedido_estado)}</p>
      </div>
      {log.producto && (
        <div className="rounded-lg border border-white/10 bg-slate-950/60 p-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Producto</p>
          <p className="mt-1 text-sm text-slate-200">
            {log.producto.titulo}
            <span className="ml-2 font-mono text-xs text-slate-500">
              {log.producto.es_activo ? 'activo' : 'inactivo'}
              {log.producto.suspendido ? ' · suspendido' : ''}
            </span>
          </p>
        </div>
      )}
      {log.usuario_correo && (
        <div className="rounded-lg border border-white/10 bg-slate-950/60 p-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Accionado por</p>
          <p className="mt-1 text-sm text-slate-200">{log.usuario} <span className="text-xs text-slate-500">({log.usuario_correo})</span></p>
        </div>
      )}
      {log.notas && (
        <div className="rounded-lg border border-white/10 bg-slate-950/60 p-3 sm:col-span-2">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Notas de auditoria</p>
          <p className="mt-1 text-sm leading-relaxed text-slate-300">{log.notas}</p>
        </div>
      )}
    </div>
  )
}

function AuditLogs() {
  const dispatch = useDispatch()
  const { auditLogs, loading } = useSelector((s) => s.admin)

  useEffect(() => {
    dispatch(fetchAuditLogs())
  }, [dispatch])

  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('')
  const [openId, setOpenId] = useState(null)

  const actions = useMemo(() => {
    const set = new Set(
      auditLogs.map((l) => clasificarEvento(l).tipo).filter(Boolean)
    )
    return [...set]
  }, [auditLogs])

  const filtered = useMemo(() => {
    let result = [...auditLogs]
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (l) =>
          (l.usuario || '').toLowerCase().includes(q) ||
          (clasificarEvento(l).tipo || '').toLowerCase().includes(q) ||
          (l.notas || '').toLowerCase().includes(q) ||
          (l.producto?.titulo || '').toLowerCase().includes(q)
      )
    }
    if (filter) result = result.filter((l) => clasificarEvento(l).tipo === filter)
    result.sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
    return result
  }, [auditLogs, search, filter])

  if (loading && auditLogs.length === 0) {
    return <LoadingSpinner className="py-20" size="lg" />
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Logs de Auditoria</h1>
        <p className="mt-1 text-sm text-slate-400">
          Historial cronologico de todas las acciones del sistema ({auditLogs.length} registros).
          Da click en un registro para ver el desglose del evento.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="w-64">
          <Input
            placeholder="Buscar en logs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-xl border border-white/10 bg-slate-800 px-4 py-2.5 text-sm text-white outline-none transition focus:border-cyan-400"
        >
          <option value="">Todas las acciones</option>
          {actions.map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
        <p className="self-center text-xs text-slate-500">
          {filtered.length} resultado{filtered.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-slate-900 p-12 text-center">
            <p className="text-slate-400">Sin resultados para la busqueda</p>
          </div>
        ) : (
          filtered.map((log) => {
            const { tipo, color } = clasificarEvento(log)
            const isOpen = openId === log.id
            return (
              <div
                key={log.id}
                className="rounded-xl border border-white/10 bg-slate-900/50 transition hover:bg-slate-900"
              >
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : log.id)}
                  className="flex w-full cursor-pointer items-start justify-between gap-4 px-5 py-4 text-left"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge color={color}>{tipo}</Badge>
                      {log.pedido_id && (
                        <span className="font-mono text-xs text-cyan-400">Pedido #{log.pedido_id}</span>
                      )}
                    </div>
                    <p className="mt-2 text-sm text-white">{log.notas || log.detalle || tipo}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3 text-right">
                    <div>
                      <p className="text-sm font-medium text-slate-300">{log.usuario}</p>
                      <p className="text-xs text-slate-500">
                        {log.fecha
                          ? new Date(log.fecha).toLocaleDateString('es-MX', {
                              day: 'numeric', month: 'short', year: 'numeric',
                              hour: '2-digit', minute: '2-digit',
                            })
                          : '—'}
                      </p>
                    </div>
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-800 text-cyan-400 transition ${isOpen ? 'rotate-180' : ''}`}
                    >
                      <svg width="10" height="10" viewBox="0 0 10 6" fill="none">
                        <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </span>
                  </div>
                </button>
                {isOpen && (
                  <div className="border-t border-white/10 px-5 py-4">
                    <EventoDesglose log={log} />
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default AuditLogs