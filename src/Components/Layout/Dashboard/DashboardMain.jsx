import Footer from '../Footer'
import Navbar from '../Navbar'

const products = [
  {
    title: 'Laptop Lenovo Ideapad',
    price: '$8,500 MXN',
    category: 'Tecnología',
    status: 'Disponible',
    description: 'Equipo ideal para clases, tareas y proyectos.',
  },
  {
    title: 'Mesa de estudio',
    price: '$1,200 MXN',
    category: 'Hogar',
    status: 'Nuevo',
    description: 'Perfecta para departamento o habitación estudiantil.',
  },
  {
    title: 'Calculadora científica',
    price: '$450 MXN',
    category: 'Escolar',
    status: 'Últimas piezas',
    description: 'Lista para ingeniería, matemáticas y física.',
  },
  {
    title: 'Audífonos inalámbricos',
    price: '$680 MXN',
    category: 'Accesorios',
    status: 'Top ventas',
    description: 'Sonido claro para clases, viajes y estudio.',
  },
]

function DashboardMain() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-white">
      <Navbar />

      <main className="flex-1 bg-white text-slate-900">
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
          <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {products.map((product) => (
              <article key={product.title} className="rounded-3xl border border-white/10 bg-slate-950 p-5 transition hover:-translate-y-1">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-cyan-300">{product.category}</p>
                    <h2 className="mt-2 text-xl font-bold text-white">{product.title}</h2>
                  </div>
                  <span className="rounded-full bg-cyan-400/15 px-3 py-1 text-xs font-semibold text-cyan-200">
                    {product.status}
                  </span>
                </div>

                <p className="mt-4 text-sm leading-6 text-slate-300">{product.description}</p>

                <div className="mt-6 flex items-center justify-between">
                  <p className="text-lg font-bold text-white">{product.price}</p>
                  <button className="rounded-xl bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300">
                    Ver más
                  </button>
                </div>
              </article>
            ))}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default DashboardMain