import { useState, useMemo, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAuditLogs } from '../../store/slices/adminSlice'
import Badge from '../Shared/Badge'
import Input from '../Shared/Input'
import LoadingSpinner from '../Shared/LoadingSpinner'

function AuditLogs() {
  const dispatch = useDispatch()
  const { auditLogs, loading } = useSelector((s) => s.admin)

  useEffect(() => {
    dispatch(fetchAuditLogs())
  }, [dispatch])

  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('')

  const actions = useMemo(() => {
    const set = new Set(auditLogs.map((l) => l.accion).filter(Boolean))
    return [...set]
  }, [auditLogs])

  const filtered = useMemo(() => {
    let result = [...auditLogs]
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (l) =>
          (l.usuario || '').toLowerCase().includes(q) ||
          (l.accion || '').toLowerCase().includes(q) ||
          (l.detalle || '').toLowerCase().includes(q)
      )
    }
    if (filter) result = result.filter((l) => l.accion === filter)
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
          Historial cronologico de todas las acciones del sistema ({auditLogs.length} registros)
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
            const actionColor =
              (log.accion || '').includes('Disputa') || (log.accion || '').includes('suspendido')
                ? 'red'
                : (log.accion || '').includes('Pago') || (log.accion || '').includes('liberado')
                  ? 'emerald'
                  : (log.accion || '').includes('verificado') || (log.accion || '').includes('Rol')
                    ? 'cyan'
                    : 'slate'
            return (
              <div
                key={log.id}
                className="rounded-xl border border-white/10 bg-slate-900/50 px-5 py-4 transition hover:bg-slate-900"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge color={actionColor}>{log.accion}</Badge>
                      {log.pedido_id && (
                        <span className="font-mono text-xs text-cyan-400">Pedido #{log.pedido_id}</span>
                      )}
                    </div>
                    <p className="mt-2 text-sm text-white">{log.detalle}</p>
                  </div>
                  <div className="shrink-0 text-right">
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
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default AuditLogs
