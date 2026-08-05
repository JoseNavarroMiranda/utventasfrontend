import { useEffect, useMemo, useRef, useState } from 'react'
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
  const resultsRef = useRef(null)
  const autoScrolledRef = useRef(false)

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

  const handleSearchChange = (value) => {
    setSearch(value)
    if (value.trim() && !autoScrolledRef.current) {
      autoScrolledRef.current = true
      requestAnimationFrame(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    }
    if (!value.trim()) autoScrolledRef.current = false
  }

  const clearAll = () => {
    setSearch('')
    autoScrolledRef.current = false
    setSearchParams({})
  }

  const hasFilters = selectedCategories.length > 0 || search.trim().length > 0

  const filtered = useMemo(() => {
    let result = products.filter(
      (p) => p.es_activo !== false && !p.suspendido && !orderedProductIds.includes(p.id)
    )

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
  }, [products, search, selectedCategories, orderedProductIds])

  return (
    <PublicLayout>
      <HeroBanner search={search} onSearchChange={handleSearchChange} />
      <CategoryGrid selected={selectedCategories} onToggle={toggleCategory} />

      <section ref={resultsRef} className="scroll-mt-6 py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white">Productos Disponibles</h2>
              <p className="mt-1 text-sm text-slate-400">
                {hasFilters
                  ? `${filtered.length} coincidencia${filtered.length !== 1 ? 's' : ''} encontrada${filtered.length !== 1 ? 's' : ''}`
                  : 'Encuentra lo que necesitas en el campus'}
              </p>
            </div>

            {hasFilters && (
              <div className="flex flex-wrap items-center gap-2">
                {selectedCategories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => toggleCategory(cat)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1.5 text-xs font-medium text-cyan-300 transition hover:border-cyan-400/60 hover:bg-cyan-400/20"
                  >
                    {cat}
                    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                ))}
                {search.trim() && (
                  <button
                    type="button"
                    onClick={() => setSearch('')}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-slate-800 px-3 py-1.5 text-xs font-medium text-white transition hover:border-white/30"
                  >
                    "{search.trim()}"
                    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
                <button
                  type="button"
                  onClick={clearAll}
                  className="px-1 py-1.5 text-xs font-medium text-slate-400 transition hover:text-white"
                >
                  Limpiar filtros
                </button>
              </div>
            )}
          </div>

          {loading ? (
            <LoadingSpinner className="py-20" size="lg" />
          ) : filtered.length === 0 ? (
            <EmptyState
              icon="🔍"
              title="Sin resultados"
              description={hasFilters ? 'Intenta con otros términos o categorías' : 'No hay productos disponibles'}
              actionLabel="Ver todos"
              onAction={clearAll}
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
