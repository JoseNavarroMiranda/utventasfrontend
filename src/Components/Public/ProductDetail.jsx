import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, Link, useNavigate } from 'react-router'
import { fetchActiveProducts, fetchOrderedProductIds, markProductAsOrdered } from '../../store/slices/productSlice'
import PublicLayout from './components/PublicLayout'
import ImageCarousel from './components/ImageCarousel'
import LoadingSpinner from '../Shared/LoadingSpinner'
import Button from '../Shared/Button'
import Badge from '../Shared/Badge'
import Modal from '../Shared/Modal'
import PayPalButton from './components/PayPalButton'

function DetailRow({ label, value }) {
  return (
    <div className="flex justify-between border-b border-white/5 py-3">
      <span className="text-sm text-slate-400">{label}</span>
      <span className="text-sm font-medium text-white text-right">{value || '—'}</span>
    </div>
  )
}

function ProductDetail() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((s) => s.auth)
  const { items: products, orderedProductIds, loading, error } = useSelector((s) => s.products)
  const [buyError, setBuyError] = useState('')
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showPayPal, setShowPayPal] = useState(false)
  const [purchaseComplete, setPurchaseComplete] = useState(false)

  useEffect(() => {
    if (products.length === 0) dispatch(fetchActiveProducts())
    dispatch(fetchOrderedProductIds())
  }, [dispatch, products.length])

  const productId = Number(id)
  const product = products.find((p) => p.id === productId)

  const isOrdered = orderedProductIds.includes(productId)

  const handleBuy = () => {
    if (!user) {
      setShowLoginModal(true)
      return
    }
    if (user.rol !== 'Comprador') {
      setBuyError('Solo los usuarios con rol de Comprador pueden realizar compras')
      return
    }
    if (isOrdered) {
      setBuyError('Este producto ya no está disponible')
      return
    }
    setShowPayPal(true)
    setBuyError('')
  }

  if (loading && products.length === 0) return <PublicLayout><LoadingSpinner className="py-20" size="lg" /></PublicLayout>
  if (!product && error) return <PublicLayout><p className="py-20 text-center text-red-400">{error}</p></PublicLayout>
  if (!product) return <PublicLayout><p className="py-20 text-center text-slate-400">Producto no encontrado</p></PublicLayout>

  return (
    <PublicLayout>
      <div className="mx-auto max-w-6xl px-6 py-10 lg:px-8">
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver a productos
        </Link>

        <div className="grid gap-8 lg:grid-cols-2">
          <ImageCarousel images={product.imagenes} productName={product.titulo} />

          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-3">
                <p className="text-xs uppercase tracking-widest text-cyan-300">{product.categoria}</p>
                {product.es_premium && <Badge color="yellow">Destacado</Badge>}
              </div>
              <h1 className="mt-2 text-3xl font-bold text-white">{product.titulo}</h1>
            </div>

            <p className="text-4xl font-bold text-white">
              ${(product.precio || 0).toLocaleString()} <span className="text-lg font-normal text-slate-400">MXN</span>
            </p>

            <p className="text-sm leading-6 text-slate-300">{product.descripcion}</p>

            <div className="rounded-2xl border border-white/10 bg-slate-900 p-5">
              <h3 className="text-sm font-semibold text-slate-400">Detalles del producto</h3>
              <div className="mt-2">
                <DetailRow label="Categoría" value={product.categoria} />
                <DetailRow label="Precio" value={`$${(product.precio || 0).toLocaleString()} MXN`} />
                <DetailRow label="Método de contacto" value={product.contacto_metodo} />
                <DetailRow
                  label="Publicado"
                  value={new Date(product.created_at).toLocaleDateString('es-MX', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                />
              </div>
            </div>

            {buyError && (
              <p className="rounded-xl bg-red-400/10 px-4 py-3 text-sm text-red-300">{buyError}</p>
            )}

            {purchaseComplete ? (
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-400/10 p-5 text-center">
                <p className="text-lg font-semibold text-emerald-300">Compra realizada con exito</p>
                <p className="mt-1 text-sm text-emerald-400/80">
                  Revisa el estado en <Link to="/comprador/compras" className="underline">Mis Compras</Link>
                </p>
              </div>
            ) : isOrdered ? (
              <div className="rounded-2xl border border-red-500/30 bg-red-400/10 p-5 text-center">
                <p className="text-lg font-semibold text-red-300">Producto no disponible</p>
                <p className="mt-1 text-sm text-red-400/80">
                  Este producto ya esta en proceso de compra
                </p>
              </div>
            ) : showPayPal ? (
              <div className="rounded-2xl border border-white/10 bg-slate-900 p-5">
                <h3 className="mb-4 text-sm font-semibold text-slate-400">Paga con PayPal</h3>
                <PayPalButton
                  productId={Number(id)}
                  onComplete={() => setPurchaseComplete(true)}
                />
              </div>
            ) : (
              <Button className="w-full" size="lg" onClick={handleBuy}>
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7.076 21.337A2.47 2.47 0 015.5 19.5V7.5h13v12a2.47 2.47 0 01-1.576 1.837l-1.384.553a5.465 5.465 0 01-4.08 0l-1.384-.553z" />
                  <path d="M3 4.5h18v2H3z" />
                </svg>
                Comprar / Reservar con PayPal
              </Button>
            )}

            <div className="rounded-2xl border border-white/10 bg-slate-900 p-5">
              <h3 className="text-sm font-semibold text-slate-400">Vendedor</h3>
              <p className="mt-2 flex items-center gap-2 text-sm font-medium text-white">
                {product.autor_nombre || `ID: ${product.id_autor || '—'}`}
                {product.autor_verificado && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
                    </svg>
                    Verificado
                  </span>
                )}
              </p>
              {product.contacto_telefono && (
                <p className="mt-1 text-xs text-slate-400">
                  Teléfono: <span className="text-slate-300">{product.contacto_telefono}</span>
                </p>
              )}
              {product.autor_correo && (
                <p className="mt-1 text-xs text-slate-400">
                  Correo: <span className="text-slate-300">{product.autor_correo}</span>
                </p>
              )}
              <p className="mt-1 text-xs text-slate-400">
                Contacto vía {product.contacto_metodo || 'whatsapp'}
              </p>
            </div>
          </div>
        </div>
      </div>
      <Modal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} title="Inicia sesión" size="sm">
        <p className="text-sm text-slate-300">
          Necesitas iniciar sesión como Comprador para poder comprar este producto.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setShowLoginModal(false)}>Cancelar</Button>
          <Button onClick={() => navigate(`/login?redirect=/productos/${id}`)}>Iniciar Sesión</Button>
        </div>
      </Modal>
    </PublicLayout>
  )
}

export default ProductDetail
