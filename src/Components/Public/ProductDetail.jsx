import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, Link } from 'react-router'
import { fetchActiveProducts } from '../../store/slices/productSlice'
import PublicLayout from './components/PublicLayout'
import ImageCarousel from './components/ImageCarousel'
import LoadingSpinner from '../Shared/LoadingSpinner'
import Button from '../Shared/Button'
import Badge from '../Shared/Badge'

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
  const { items: products, loading, error } = useSelector((s) => s.products)

  useEffect(() => {
    if (products.length === 0) dispatch(fetchActiveProducts())
  }, [dispatch, products.length])

  const product = products.find((p) => p.id === Number(id))

  if (loading) return <PublicLayout><LoadingSpinner className="py-20" size="lg" /></PublicLayout>
  if (error) return <PublicLayout><p className="py-20 text-center text-red-400">{error}</p></PublicLayout>
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

            <Button className="w-full" size="lg">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7.076 21.337A2.47 2.47 0 015.5 19.5V7.5h13v12a2.47 2.47 0 01-1.576 1.837l-1.384.553a5.465 5.465 0 01-4.08 0l-1.384-.553z" />
                <path d="M3 4.5h18v2H3z" />
              </svg>
              Comprar / Reservar con PayPal
            </Button>

            <div className="rounded-2xl border border-white/10 bg-slate-900 p-5">
              <h3 className="text-sm font-semibold text-slate-400">Vendedor</h3>
              <p className="mt-2 text-sm font-medium text-white">
                {product.autor_nombre || `ID: ${product.id_autor || '—'}`}
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Contacto vía {product.contacto_metodo || 'whatsapp'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}

export default ProductDetail
