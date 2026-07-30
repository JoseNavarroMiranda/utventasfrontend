import { Link } from 'react-router'

function ProductCard({ product }) {
  const imgSrc = product.imagenes?.[0]
  return (
    <Link
      to={`/productos/${product.id}`}
      className="group block rounded-2xl border border-white/10 bg-slate-900 transition hover:border-cyan-400/30 hover:bg-slate-800"
    >
      <div className="aspect-[1/1] overflow-hidden rounded-t-2xl bg-slate-800 sm:aspect-[4/3]">
        {imgSrc ? (
          <img src={imgSrc} alt={product.titulo} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-700/50 to-slate-800/50">
            <svg className="h-12 w-12 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>

      <div className="p-3 sm:p-5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="text-[10px] uppercase tracking-widest text-cyan-300 sm:text-xs">{product.categoria}</p>
            <h3 className="mt-0.5 text-sm font-bold text-white truncate sm:mt-1 sm:text-lg">{product.titulo}</h3>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            {product.autor_verificado && (
              <span className="inline-flex items-center rounded-full bg-emerald-400/15 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-300 sm:px-2" title="Vendedor verificado">
                <svg className="mr-0.5 h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
                </svg>
                Verif.
              </span>
            )}
            {product.es_premium && (
              <span className="rounded-full bg-yellow-400/15 px-2 py-0.5 text-[10px] font-semibold text-yellow-200 sm:px-3 sm:py-1 sm:text-xs">
                Destacado
              </span>
            )}
          </div>
        </div>

        <p className="mt-2 line-clamp-1 text-xs leading-5 text-slate-400 sm:mt-3 sm:line-clamp-2 sm:text-sm sm:leading-6">{product.descripcion}</p>

        <div className="mt-3 flex flex-wrap items-center gap-2 sm:mt-4">
          <p className="text-sm font-bold text-white sm:text-lg">${(product.precio || 0).toLocaleString()} MXN</p>
          <span className="rounded-xl bg-cyan-400 px-2 py-1 text-[10px] font-semibold text-slate-950 transition group-hover:bg-cyan-300 sm:px-4 sm:py-2 sm:text-sm">
            Ver detalle
          </span>
        </div>
      </div>
    </Link>
  )
}

export default ProductCard
