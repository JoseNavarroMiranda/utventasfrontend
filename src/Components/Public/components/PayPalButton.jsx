import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { markProductAsOrdered } from '../../../store/slices/productSlice'
import { API_BASE } from '../../../constants'
import { api } from '../../../services/api'
import LoadingSpinner from '../../Shared/LoadingSpinner'

function PayPalButton({ productId, onComplete }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { orderedProductIds } = useSelector((s) => s.products)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [success, setSuccess] = useState('')
  const [processing, setProcessing] = useState(false)
  const [clientId, setClientId] = useState(null)
  const containerRef = useRef(null)
  const buttonsRendered = useRef(false)
  const completed = useRef(false)

  const confirmRetention = async (orderId) => {
    if (completed.current) return
    setProcessing(true)
    setError('')
    setNotice('')
    setSuccess('')
    try {
      await api.put('/api/pedidos/confirmar-retencion', { paypal_order_id: orderId, producto_id: productId })
      completed.current = true
      setProcessing(false)
      setSuccess('Tu compra se completó correctamente. Los fondos están en escrow. Redirigiendo a tus compras...')
      dispatch(markProductAsOrdered(productId))
      onComplete?.()
      setTimeout(() => navigate('/comprador/compras'), 1600)
    } catch (err) {
      setProcessing(false)
      setError(
        err.message ||
          'Tu compra no se finalizó correctamente. El pedido no fue marcado como completado. Intenta nuevamente.'
      )
    }
  }

  useEffect(() => {
    fetch(`${API_BASE}/api/config/paypal`)
      .then((r) => r.text())
      .then((id) => {
        setClientId(id.trim())
      })
      .catch(() => {
        setError('No se pudo cargar la configuracion de PayPal')
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    if (!clientId || !containerRef.current || buttonsRendered.current) return

    buttonsRendered.current = true
    setLoading(true)

    const script = document.createElement('script')
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=MXN&intent=authorize`
    script.async = true
    script.onload = () => {
      if (!window.paypal || !containerRef.current) {
        setLoading(false)
        return
      }

      window.paypal.Buttons({
        createOrder: async () => {
          if (orderedProductIds.includes(productId)) {
            throw new Error('Este producto ya no esta disponible')
          }
          setError('')
          setNotice('')
          setSuccess('')
          const res = await api.post('/api/pedidos/', { producto_id: productId })
          return res.data?.paypal_order_id
        },
        onApprove: async (data) => {
          await confirmRetention(data.orderID)
        },
        onCancel: () => {
          setProcessing(false)
          setNotice(
            'Pago cancelado. Tu compra NO fue marcada como completada. Puedes intentarlo de nuevo.'
          )
        },
        onError: () => {
          setProcessing(false)
          setError(
            'Ocurrió un error con PayPal. Tu compra no se finalizó correctamente y no fue marcada como completada. Intenta nuevamente.'
          )
        },
      }).render(containerRef.current)
        .then(() => setLoading(false))
        .catch(() => {
          setError('Error al renderizar los botones de PayPal')
          setLoading(false)
        })
    }
    script.onerror = () => {
      setError('No se pudo cargar el SDK de PayPal')
      setLoading(false)
    }
    document.body.appendChild(script)

    return () => {
      if (script.parentNode) script.parentNode.removeChild(script)
      buttonsRendered.current = false
    }
  }, [clientId, productId, navigate, onComplete, orderedProductIds])

  if (error) {
    return <p className="rounded-xl bg-red-400/10 px-4 py-3 text-sm text-red-300">{error}</p>
  }

  return (
    <div className="space-y-3">
      <div ref={containerRef} className="min-h-[40px]" />
      {success && (
        <p className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-300">
          ✓ {success}
        </p>
      )}
      {notice && (
        <p className="rounded-xl border border-yellow-400/30 bg-yellow-400/10 px-4 py-3 text-sm text-yellow-200">
          {notice}
        </p>
      )}
      {error && (
        <p className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          ✕ {error}
        </p>
      )}
      {processing && (
        <div className="flex items-center justify-center gap-2 py-2">
          <LoadingSpinner size="sm" />
          <span className="text-sm text-slate-400">Confirmando pago con PayPal...</span>
        </div>
      )}
      {loading && !processing && (
        <div className="flex justify-center py-2">
          <LoadingSpinner size="sm" />
        </div>
      )}
    </div>
  )
}

export default PayPalButton