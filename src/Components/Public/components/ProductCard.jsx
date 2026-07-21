import { Link } from 'react-router'

function ProductCard({ product }) {
  return (
    <Link
      to={`/productos/${product.id}`}
      className="group block rounded-2xl border border-white/10 bg-slate-900 p-5 transition hover:border-cyan-400/30 hover:bg-slate-800"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs uppercase tracking-widest text-cyan-300">{product.categoria}</p>
          <h3 className="mt-1 text-lg font-bold text-white truncate">{product.titulo}</h3>
        </div>
        {product.es_premium && (
          <span className="shrink-0 rounded-full bg-yellow-400/15 px-3 py-1 text-xs font-semibold text-yellow-200">
            Destacado
          </span>
        )}
      </div>

      <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-400">{product.descripcion}</p>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-lg font-bold text-white">${(product.precio || 0).toLocaleString()} MXN</p>
        <span className="rounded-xl bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition group-hover:bg-cyan-300">
          Ver detalle
        </span>
      </div>
    </Link>
  )
}

export default ProductCard
