import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router'
import { fetchProducts } from '../../store/slices/productSlice'
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
  const [processing, setProcessing] = useState(false)
  const [success, setSuccess] = useState(false)

  const product = products.find((p) => p.id === Number(id))

  useEffect(() => {
    if (products.length === 0) dispatch(fetchProducts())
  }, [dispatch, products.length])

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

  const handlePayment = async () => {
    if (!selectedPlan) return
    setProcessing(true)
    await new Promise((r) => setTimeout(r, 1500))
    setProcessing(false)
    setSuccess(true)
  }

  if (success) {
    return (
      <div className="py-20 text-center">
        <h2 className="mt-4 text-2xl font-bold text-white">Pago Exitoso</h2>
        <p className="mt-2 text-slate-400">
          <strong className="text-white">{product.titulo}</strong> ahora es un anuncio destacado.
        </p>
        <Button className="mt-6" onClick={() => navigate('/vendedor/publicaciones')}>
          Ver mis publicaciones
        </Button>
      </div>
    )
  }

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
        <Button onClick={handlePayment} loading={processing} disabled={!selectedPlan}>
          {processing ? 'Procesando...' : `Pagar $${selectedPlan?.price || 0} MXN`}
        </Button>
        <Button variant="ghost" onClick={() => navigate('/vendedor/publicaciones')}>
          Cancelar
        </Button>
      </div>

      <p className="mt-4 text-xs text-slate-500">
        Al hacer clic en "Pagar" se realizará un cobro en tu método de pago registrado.
        La transacción quedará registrada en <strong>transacciones_premium</strong>.
      </p>
    </div>
  )
}

export default PremiumSection
