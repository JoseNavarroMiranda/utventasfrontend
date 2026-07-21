import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router'
import { fetchProducts } from '../../store/slices/productSlice'
import PublicLayout from './components/PublicLayout'
import HeroBanner from './components/HeroBanner'
import CategoryGrid from './components/CategoryGrid'
import ProductCard from './components/ProductCard'
import LoadingSpinner from '../Shared/LoadingSpinner'
import EmptyState from '../Shared/EmptyState'

function Home() {
  const dispatch = useDispatch()
  const { items: products, loading } = useSelector((s) => s.products)
  const [search, setSearch] = useState('')
  const [searchParams] = useSearchParams()
  const categoryFilter = searchParams.get('categoria') || ''

  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch])

  const filtered = useMemo(() => {
    let result = products.filter((p) => p.es_activo !== false)

    if (categoryFilter) {
      result = result.filter((p) => p.categoria === categoryFilter)
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (p) =>
          p.titulo?.toLowerCase().includes(q) ||
          p.descripcion?.toLowerCase().includes(q)
      )
    }

    return result.sort((a, b) => {
      if (a.es_premium && !b.es_premium) return -1
      if (!a.es_premium && b.es_premium) return 1
      return new Date(b.created_at) - new Date(a.created_at)
    })
  }, [products, search, categoryFilter])

  return (
    <PublicLayout>
      <HeroBanner search={search} onSearchChange={setSearch} />
      <CategoryGrid />

      <section className="py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">
                {categoryFilter ? `Categoría: ${categoryFilter}` : 'Productos Disponibles'}
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                {categoryFilter
                  ? `Explora productos en ${categoryFilter}`
                  : 'Encuentra lo que necesitas en el campus'}
              </p>
            </div>
            {search && (
              <p className="text-sm text-slate-400">
                {filtered.length} resultado{filtered.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>

          {loading ? (
            <LoadingSpinner className="py-20" size="lg" />
          ) : filtered.length === 0 ? (
            <EmptyState
              icon="🔍"
              title="Sin resultados"
              description={search ? 'Intenta con otros términos' : 'No hay productos disponibles'}
              actionLabel="Ver todos"
              onAction={() => {
                setSearch('')
                window.history.replaceState({}, '', '/')
              }}
            />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </PublicLayout>
  )
}

export default Home
