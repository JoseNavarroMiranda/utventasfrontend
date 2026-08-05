import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import { updateUser } from '../../store/slices/authSlice'
import { api } from '../../services/api'
import { API_BASE } from '../../constants'
import Button from '../Shared/Button'
import LoadingSpinner from '../Shared/LoadingSpinner'

const VERIFICATION_PRICE = 29

function SellerVerification() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((s) => s.auth)
  const [clientId, setClientId] = useState(null)
  const [paypalLoaded, setPaypalLoaded] = useState(false)
  const [paypalError, setPaypalError] = useState('')
  const [notice, setNotice] = useState('')
  const [success, setSuccess] = useState(false)
  const containerRef = useRef(null)
  const buttonsRendered = useRef(false)
  const completed = useRef(false)

  useEffect(() => {
    fetch(`${API_BASE}/api/config/paypal`)
      .then((r) => r.text())
      .then((id) => setClientId(id.trim()))
      .catch(() => setPaypalError('No se pudo cargar la configuracion de PayPal'))
  }, [])

  useEffect(() => {
    if (user?.verificado_como_vendedor) {
      setSuccess(true)
      return
    }
    if (!clientId || !containerRef.current || buttonsRendered.current) return
    buttonsRendered.current = true

    const script = document.createElement('script')
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=MXN&intent=capture`
    script.async = true
    script.onload = () => {
      if (!window.paypal || !containerRef.current) return
      window.paypal.Buttons({
        createOrder: async () => {
          setPaypalError('')
          setNotice('')
          const res = await api.post('/api/vendedor/crear-orden-paypal', {
            monto: VERIFICATION_PRICE,
            descripcion: 'Verificación de vendedor UTVentas'
          })
          if (!res?.id) throw new Error('No se pudo crear la orden en PayPal')
          return res.id
        },
        onApprove: async (data) => {
          if (completed.current) return
          completed.current = true
          try {
            const res = await api.post('/api/vendedor/verificar', { orderId: data.orderID })
            if (res.data?.verificado_como_vendedor) {
              dispatch(updateUser({ verificado_como_vendedor: true }))
            }
            setSuccess(true)
          } catch (err) {
            completed.current = false
            setPaypalError(err?.message || 'No se pudo confirmar el pago en PayPal')
          }
        },
        onCancel: () => {
          setNotice('Pago cancelado. Puedes intentarlo de nuevo.')
        },
        onError: () => {
          setPaypalError('Ocurrió un error con PayPal. Intenta nuevamente.')
        },
      }).render(containerRef.current)
        .then(() => setPaypalLoaded(true))
        .catch(() => setPaypalError('Error al renderizar PayPal'))
    }
    script.onerror = () => setPaypalError('No se pudo cargar el SDK de PayPal')
    document.body.appendChild(script)

    return () => {
      if (script.parentNode) script.parentNode.removeChild(script)
      buttonsRendered.current = false
    }
  }, [clientId, user?.verificado_como_vendedor, dispatch])

  if (success) {
    return (
      <div className="py-20 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-400/10">
          <svg className="h-8 w-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white">Vendedor Verificado</h2>
        <p className="mt-2 text-slate-400">
          {user?.verificado_como_vendedor
            ? 'Ya estás verificado como vendedor.'
            : 'Tu solicitud de verificación ha sido procesada.'}
        </p>
        <Button className="mt-6" onClick={() => navigate('/vendedor/dashboard')}>
          Ir al Dashboard
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Verificar Cuenta de Vendedor</h1>
        <p className="mt-1 text-sm text-slate-400">
          Verifica tu cuenta para que los compradores sepan que eres un vendedor de confianza.
        </p>
      </div>

      <div className="mb-8 space-y-4 rounded-2xl border border-white/10 bg-slate-900 p-6">
        <h3 className="font-semibold text-white">Beneficios de ser vendedor verificado:</h3>
        <ul className="space-y-2 text-sm text-slate-300">
          <li className="flex items-center gap-2">
            <svg className="h-4 w-4 shrink-0 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Insignia de verificado en tus publicaciones
          </li>
          <li className="flex items-center gap-2">
            <svg className="h-4 w-4 shrink-0 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Mayor confianza de los compradores
          </li>
          <li className="flex items-center gap-2">
            <svg className="h-4 w-4 shrink-0 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Prioridad en resultados de búsqueda
          </li>
        </ul>
      </div>

      <div className="mb-8 rounded-2xl border border-white/10 bg-slate-900 p-6 text-center">
        <p className="text-sm text-slate-400">Costo de verificación único</p>
        <p className="mt-1 text-4xl font-bold text-white">${VERIFICATION_PRICE} MXN</p>
      </div>

      {paypalError && (
        <div className="mb-4 rounded-xl bg-red-400/10 px-4 py-3 text-sm text-red-300">{paypalError}</div>
      )}

      {!paypalError && (
        <div ref={containerRef} className="min-h-[40px]" />
      )}

      {notice && (
        <div className="mt-4 rounded-xl bg-yellow-400/10 px-4 py-3 text-sm text-yellow-200">{notice}</div>
      )}

      {!paypalLoaded && !paypalError && (
        <div className="flex justify-center py-4">
          <LoadingSpinner size="sm" />
        </div>
      )}

      <p className="mt-4 text-xs text-slate-500">
        La verificación se activará únicamente cuando PayPal confirme el cobro correctamente.
      </p>
    </div>
  )
}

export default SellerVerification
