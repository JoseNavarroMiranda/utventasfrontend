import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router'
import { fetchActiveProducts, fetchOrderedProductIds } from '../../store/slices/productSlice'
import PublicLayout from './components/PublicLayout'
import HeroBanner from './components/HeroBanner'
import CategoryGrid from './components/CategoryGrid'
import ProductCard from './components/ProductCard'
import LoadingSpinner from '../Shared/LoadingSpinner'
import EmptyState from '../Shared/EmptyState'

function Home() {
  const dispatch = useDispatch()
  const { items: products, orderedProductIds, loading } = useSelector((s) => s.products)
  const [search, setSearch] = useState('')
  const [searchParams, setSearchParams] = useSearchParams()
  const selectedCategories = searchParams.getAll('categoria')

  useEffect(() => {
    dispatch(fetchActiveProducts())
    dispatch(fetchOrderedProductIds())
  }, [dispatch])

  const toggleCategory = (category) => {
    const next = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category]
    setSearchParams(next.length ? { categoria: next } : {}, { replace: true })
  }

  const filtered = useMemo(() => {
    let result = products.filter((p) => p.es_activo !== false && !orderedProductIds.includes(p.id))

    if (selectedCategories.length > 0) {
      result = result.filter((p) => selectedCategories.includes(p.categoria))
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
  }, [products, search, selectedCategories])

  return (
    <PublicLayout>
      <HeroBanner search={search} onSearchChange={setSearch} />
      <CategoryGrid selected={selectedCategories} onToggle={toggleCategory} />

      <section className="py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Productos Disponibles</h2>
              <p className="mt-1 text-sm text-slate-400">
                {selectedCategories.length > 0
                  ? 'Explora los productos de la categoría seleccionada'
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
                setSearchParams({})
              }}
            />
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
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
