function HeroBanner({ search, onSearchChange }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 py-20 lg:py-32">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-16 -top-16 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute right-0 top-1/4 h-72 w-72 rounded-full bg-cyan-400/15 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-fuchsia-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-4xl px-6 text-center lg:px-8">
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl">
          UTVentas
        </h1>
        <p className="mt-4 text-lg text-slate-300 sm:text-xl">
          Vende rápido. Compra seguro. Conecta con tu campus.
        </p>

        <div className="mx-auto mt-10 max-w-xl">
          <div className="relative">
            <svg className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Busca productos, servicios, espacios..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-slate-800/80 py-4 pr-12 pl-12 text-base text-white placeholder-slate-400 outline-none backdrop-blur transition focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20"
            />
            {search && (
              <button
                type="button"
                aria-label="Limpiar búsqueda"
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-slate-400 transition hover:bg-white/10 hover:text-white"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>


      </div>
    </section>
  )
}

export default HeroBanner
