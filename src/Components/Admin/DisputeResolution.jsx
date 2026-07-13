import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { resolveDispute } from '../../store/slices/adminSlice'
import { Table, Td } from '../Shared/Table'
import Badge from '../Shared/Badge'
import Button from '../Shared/Button'
import Modal from '../Shared/Modal'

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
  const [note, setNote] = useState('')
  const [noteRequired, setNoteRequired] = useState(false)

  const openDetail = (dispute) => {
    setSelected(dispute)
    setNote('')
    setNoteRequired(false)
  }

  const handleResolve = (estado) => {
    if (!note.trim()) {
      setNoteRequired(true)
      return
    }
    dispatch(resolveDispute({ id: selected.id, estado, notas_auditoria: note.trim() }))
    setSelected(null)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Resolucion de Disputas</h1>
        <p className="mt-1 text-sm text-slate-400">{disputes.length} disputas activas pendientes de revision</p>
      </div>

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

            <div className="flex items-center justify-between border-t border-white/10 pt-4">
              <p className="text-sm text-slate-400">
                Monto en disputa: <strong className="text-white">${selected.monto.toLocaleString()} MXN</strong>
              </p>
              <div className="flex gap-3">
                <Button
                  variant="danger"
                  onClick={() => handleResolve('cancelado_reembolsado')}
                >
                  Reembolsar al Comprador
                </Button>
                <Button
                  variant="primary"
                  onClick={() => handleResolve('delivered_completed')}
                >
                  Liberar al Vendedor
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default DisputeResolution
