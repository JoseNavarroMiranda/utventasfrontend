import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchPendingPayouts, approveWithdrawal } from '../../store/slices/adminSlice'
import { Table, Td } from '../Shared/Table'
import Button from '../Shared/Button'
import Input from '../Shared/Input'
import Modal from '../Shared/Modal'

function PayoutManagement() {
  const dispatch = useDispatch()
  const { pendingPayouts } = useSelector((s) => s.admin)
  const { items: withdrawalHistory } = useSelector((s) => s.withdrawals)
  const [batchModal, setBatchModal] = useState(null)

  useEffect(() => {
    dispatch(fetchPendingPayouts())
  }, [dispatch])
  const [batchId, setBatchId] = useState('')
  const [mode, setMode] = useState('single')
  const [batchOpen, setBatchOpen] = useState(false)

  const openApprove = (payout) => {
    setBatchModal(payout)
    setBatchId('')
    setMode('single')
  }

  const openBatchApprove = () => {
    setBatchModal(null)
    setBatchId('')
    setMode('batch')
    setBatchOpen(true)
  }

  const handleApprove = () => {
    if (!batchModal) return
    dispatch(approveWithdrawal({
      id: batchModal.id,
      paypal_payout_batch_id: batchId || `BATCH-${Date.now()}`,
    }))
    setBatchModal(null)
  }

  const handleBatchApprove = () => {
    pendingPayouts.forEach((p) => {
      dispatch(approveWithdrawal({
        id: p.id,
        paypal_payout_batch_id: batchId || `BATCH-${Date.now()}`,
      }))
    })
    setBatchOpen(false)
  }

  const totalPending = pendingPayouts.reduce((s, p) => s + (p.monto || 0), 0)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Gestion de Pagos y Payouts</h1>
        <p className="mt-1 text-sm text-slate-400">
          {pendingPayouts.length} solicitudes pendientes - Total: ${totalPending.toLocaleString()} MXN
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-slate-900 p-6 border-l-4 border-l-yellow-400">
          <p className="text-sm text-slate-400">Pendientes</p>
          <p className="mt-2 text-3xl font-bold text-white">{pendingPayouts.length}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-slate-900 p-6 border-l-4 border-l-blue-400">
          <p className="text-sm text-slate-400">Total a pagar</p>
          <p className="mt-2 text-3xl font-bold text-white">${totalPending.toLocaleString()} MXN</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-slate-900 p-6 border-l-4 border-l-emerald-400">
          <p className="text-sm text-slate-400">Procesados</p>
          <p className="mt-2 text-3xl font-bold text-white">{withdrawalHistory.length}</p>
        </div>
      </div>

      {pendingPayouts.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-slate-900 p-12 text-center">
          <p className="text-slate-400">No hay solicitudes de retiro pendientes</p>
        </div>
      ) : (
        <Table
          headers={[
            { label: 'Vendedor' },
            { label: 'PayPal destino' },
            { label: 'Monto' },
            { label: 'Solicitado' },
            { label: 'Accion', right: true },
          ]}
        >
          {pendingPayouts.map((p) => (
            <tr key={p.id} className="transition hover:bg-white/[0.02]">
              <Td><p className="font-medium text-white">{p.vendedor}</p></Td>
              <Td className="text-slate-300 font-mono text-xs">{p.correo_paypal_destino}</Td>
              <Td className="font-medium text-white">${(p.monto || 0).toLocaleString()} MXN</Td>
              <Td className="text-xs text-slate-400">
                {new Date(p.created_at).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })}
              </Td>
              <Td right>
                <div className="flex justify-end gap-2">
                  <Button size="sm" onClick={() => openApprove(p)}>Autorizar Pago</Button>
                </div>
              </Td>
            </tr>
          ))}
        </Table>
      )}

      <div className="rounded-2xl border border-white/10 bg-slate-900 p-6">
        <h2 className="mb-4 text-lg font-bold text-white">Pagos Masivos</h2>
        <p className="mb-4 text-sm text-slate-400">
          Procesar todos los pagos pendientes ({pendingPayouts.length} solicitudes, ${totalPending.toLocaleString()} MXN) mediante la API de PayPal.
        </p>
        <Button
          disabled={pendingPayouts.length === 0}
          onClick={openBatchApprove}
        >
          Procesar Pago Masivo
        </Button>
      </div>

      <Modal isOpen={!!batchModal || batchOpen} onClose={() => { setBatchModal(null); setBatchOpen(false) }} title={mode === 'batch' ? 'Pago Masivo' : 'Autorizar Pago'} size="sm">
        {mode === 'batch' ? (
          <>
            <p className="mb-4 text-sm text-slate-300">
              Se procesaran <strong className="text-white">{pendingPayouts.length} retiros</strong> por un total de <strong className="text-white">${totalPending.toLocaleString()} MXN</strong>.
            </p>
            <Input
              label="PayPal Payout Batch ID"
              placeholder="Ej. BATCH-XXXXX"
              value={batchId}
              onChange={(e) => setBatchId(e.target.value)}
            />
            <p className="mt-2 text-xs text-slate-500">
              Si se deja vacio, se generara un ID automaticamente.
            </p>
          </>
        ) : (
          <>
            <p className="mb-1 text-sm text-slate-300">
              Autorizar retiro de <strong className="text-white">${batchModal?.monto?.toLocaleString()} MXN</strong>
            </p>
            <p className="mb-4 text-sm text-slate-400">
              a <strong className="text-white">{batchModal?.correo_paypal_destino}</strong> ({batchModal?.vendedor})
            </p>
            <Input
              label="PayPal Payout Batch ID"
              placeholder="Ej. BATCH-XXXXX"
              value={batchId}
              onChange={(e) => setBatchId(e.target.value)}
            />
            <p className="mt-2 text-xs text-slate-500">
              Este ID quedara registrado en el historico de pagos.
            </p>
          </>
        )}
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onClick={() => { setBatchModal(null); setBatchOpen(false) }}>Cancelar</Button>
          <Button onClick={mode === 'batch' ? handleBatchApprove : handleApprove}>
            {mode === 'batch' ? 'Procesar todo' : 'Autorizar Pago'}
          </Button>
        </div>
      </Modal>
    </div>
  )
}

export default PayoutManagement
