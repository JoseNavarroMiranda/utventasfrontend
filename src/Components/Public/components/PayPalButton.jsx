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
  const [clientId, setClientId] = useState(null)
  const containerRef = useRef(null)
  const buttonsRendered = useRef(false)
  const completed = useRef(false)
  const orderIdRef = useRef(null)

  const completePurchase = async () => {
    if (completed.current) return
    completed.current = true
    try {
      if (orderIdRef.current) {
        await api.put('/api/pedidos/confirmar-retencion', { paypal_order_id: orderIdRef.current })
      }
    } catch {
    }
    dispatch(markProductAsOrdered(productId))
    onComplete?.()
    navigate('/comprador/compras')
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
          const res = await api.post('/api/pedidos/', { producto_id: productId })
          orderIdRef.current = res.data?.paypal_order_id
          return orderIdRef.current
        },
        onApprove: async () => {
          completePurchase()
        },
        onCancel: () => {
          completePurchase()
        },
        onError: () => {
          completePurchase()
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
  }, [clientId, productId, navigate, onComplete])

  if (error) {
    return <p className="rounded-xl bg-red-400/10 px-4 py-3 text-sm text-red-300">{error}</p>
  }

  return (
    <div className="space-y-3">
      <div ref={containerRef} className="min-h-[40px]" />
      {loading && (
        <div className="flex justify-center py-2">
          <LoadingSpinner size="sm" />
        </div>
      )}
    </div>
  )
}

export default PayPalButton
