import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router'
import { fetchProducts, promoteToPremium } from '../../store/slices/productSlice'
import { api } from '../../services/api'
import { API_BASE } from '../../constants'
import Button from '../Shared/Button'
import LoadingSpinner from '../Shared/LoadingSpinner'
import Badge from '../Shared/Badge'

const PREMIUM_PLANS = [
  { days: 7, label: '7 días', price: 49, desc: 'Destaca tu anuncio por una semana' },
  { days: 15, label: '15 días', price: 79, desc: 'Mayor visibilidad por quincena' },
  { days: 30, label: '30 días', price: 129, desc: 'Máxima exposición por un mes' },
]

function PremiumSection() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { id } = useParams()
  const { items: products, loading } = useSelector((s) => s.products)
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [showPayPal, setShowPayPal] = useState(false)
  const [success, setSuccess] = useState(false)
  const [clientId, setClientId] = useState(null)
  const [paypalLoaded, setPaypalLoaded] = useState(false)
  const [paypalError, setPaypalError] = useState('')
  const [notice, setNotice] = useState('')
  const containerRef = useRef(null)
  const buttonsRendered = useRef(false)
  const completed = useRef(false)

  const product = products.find((p) => p.id === Number(id))

  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch])

  useEffect(() => {
    fetch(`${API_BASE}/api/config/paypal`)
      .then((r) => r.text())
      .then((id) => setClientId(id.trim()))
      .catch(() => setPaypalError('No se pudo cargar la configuracion de PayPal'))
  }, [])

  useEffect(() => {
    if (!clientId || !showPayPal || !containerRef.current || buttonsRendered.current) return
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
            monto: selectedPlan.price,
            descripcion: `Destacar "${product.titulo}" - Plan ${selectedPlan.days} días`
          })
          if (!res?.id) throw new Error('No se pudo crear la orden en PayPal')
          return res.id
        },
        onApprove: async (data) => {
          if (completed.current) return
          completed.current = true
          try {
            await dispatch(promoteToPremium({ id: product.id, orderId: data.orderID, dias: selectedPlan.days, monto: selectedPlan.price })).unwrap()
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
    script.onerror = () => {
      setPaypalError('No se pudo cargar el SDK de PayPal')
    }
    document.body.appendChild(script)
    return () => {
      if (script.parentNode) script.parentNode.removeChild(script)
      buttonsRendered.current = false
    }
  }, [clientId, showPayPal, selectedPlan, product, dispatch])

  if (loading && !product) return <LoadingSpinner className="py-20" size="lg" />

  if (!product) {
    return (
      <div className="py-20 text-center">
        <p className="text-slate-400">Producto no encontrado</p>
        <Button className="mt-4" onClick={() => navigate('/vendedor/publicaciones')}>
          Volver a mis publicaciones
        </Button>
      </div>
    )
  }

  if (product.es_premium) {
    return (
      <div className="py-20 text-center">
        <h2 className="mt-4 text-2xl font-bold text-white">Anuncio Destacado</h2>
        <p className="mt-2 text-slate-400">
          <strong className="text-white">{product.titulo}</strong> ya es premium y tiene máxima visibilidad.
        </p>
        <Button className="mt-6" variant="ghost" onClick={() => navigate('/vendedor/publicaciones')}>
          Volver a mis publicaciones
        </Button>
      </div>
    )
  }

  if (product.es_activo === false) {
    return (
      <div className="py-20 text-center">
        <h2 className="mt-4 text-2xl font-bold text-white">Producto vendido</h2>
        <p className="mt-2 text-slate-400">
          <strong className="text-white">{product.titulo}</strong> ya está marcado como vendido y no se puede destacar.
        </p>
        <Button className="mt-6" variant="ghost" onClick={() => navigate('/vendedor/publicaciones')}>
          Volver a mis publicaciones
        </Button>
      </div>
    )
  }

  if (success) {
    return (
      <div className="py-20 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-400/10">
          <svg className="h-8 w-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white">Anuncio Destacado</h2>
        <p className="mt-2 text-slate-400">
          <strong className="text-white">{product.titulo}</strong> ahora es un anuncio destacado
          {selectedPlan && <span> por {selectedPlan.days} días</span>}.
        </p>
        <Button className="mt-6" onClick={() => navigate('/vendedor/publicaciones')}>
          Ver mis publicaciones
        </Button>
      </div>
    )
  }

  if (!showPayPal) {
    return (
      <div className="max-w-2xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Destacar Anuncio</h1>
          <p className="mt-1 text-sm text-slate-400">
            Aumenta la visibilidad de tu producto para vender más rápido.
          </p>
        </div>

        <div className="mb-8 rounded-2xl border border-white/10 bg-slate-900 p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-cyan-400/10 text-2xl">
              {product.imagenes?.[0] ? (
                <img src={product.imagenes[0]} alt="" className="h-full w-full rounded-xl object-cover" />
              ) : null}
            </div>
            <div>
              <h3 className="font-bold text-white">{product.titulo}</h3>
              <p className="text-sm text-slate-400">
                ${(product.precio || 0).toLocaleString()} MXN • {product.categoria || 'Sin categoría'}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {PREMIUM_PLANS.map((plan) => (
            <button
              key={plan.days}
              type="button"
              onClick={() => setSelectedPlan(plan)}
              className={`rounded-2xl border p-5 text-left transition ${
                selectedPlan?.days === plan.days
                  ? 'border-cyan-400 bg-cyan-400/10'
                  : 'border-white/10 bg-slate-900 hover:border-white/20'
              }`}
            >
              <div className="mb-3">
                <Badge color={selectedPlan?.days === plan.days ? 'cyan' : 'slate'}>
                  {plan.label}
                </Badge>
              </div>
              <p className="text-2xl font-bold text-white">${plan.price} MXN</p>
              <p className="mt-1 text-xs text-slate-400">{plan.desc}</p>
            </button>
          ))}
        </div>

        <div className="mt-8 flex items-center gap-3">
          <Button onClick={() => setShowPayPal(true)} disabled={!selectedPlan}>
            Pagar con PayPal ${selectedPlan?.price || 0} MXN
          </Button>
          <Button variant="ghost" onClick={() => navigate('/vendedor/publicaciones')}>
            Cancelar
          </Button>
        </div>

        <p className="mt-4 text-xs text-slate-500">
          Al hacer clic en "Pagar" se abrirá PayPal para procesar el pago.
          Tu anuncio se destacará solo cuando el pago se complete correctamente.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Completar pago</h1>
        <p className="mt-1 text-sm text-slate-400">
          Plan {selectedPlan?.label} — ${selectedPlan?.price} MXN
        </p>
      </div>

      <div className="mb-8 rounded-2xl border border-white/10 bg-slate-900 p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-400/10">
            {product.imagenes?.[0] ? (
              <img src={product.imagenes[0]} alt="" className="h-full w-full rounded-lg object-cover" />
            ) : null}
          </div>
          <div>
            <h3 className="font-semibold text-white">{product.titulo}</h3>
            <Badge color="cyan">{selectedPlan?.label}</Badge>
          </div>
        </div>
      </div>

      {paypalError && (
        <div className="mb-4 rounded-xl bg-red-400/10 px-4 py-3 text-sm text-red-300">{paypalError}</div>
      )}

      <div ref={containerRef} className="min-h-[40px]" />
      {!paypalLoaded && !paypalError && (
        <div className="flex justify-center py-4">
          <LoadingSpinner size="sm" />
        </div>
      )}
      {notice && (
        <div className="mt-4 rounded-xl bg-yellow-400/10 px-4 py-3 text-sm text-yellow-200">{notice}</div>
      )}

      <p className="mt-4 text-xs text-slate-500">
        El anuncio se destacará únicamente cuando PayPal confirme el cobro correctamente.
      </p>
    </div>
  )
}

export default PremiumSection
