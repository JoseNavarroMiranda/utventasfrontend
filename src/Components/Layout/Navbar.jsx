import { Link } from 'react-router'

function Navbar() {
  return (
    <header className="border-b border-white/10 bg-slate-950/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <Link to="/" className="text-lg font-black tracking-tight text-white">
          UTVentas
        </Link>

        <nav className="flex items-center gap-4 text-sm text-slate-200">
          <Link className="transition hover:text-cyan-300" to="/">
            Productos
          </Link>
          <Link className="transition hover:text-cyan-300" to="/comprador/dashboard">
            Comprador
          </Link>
          <Link className="transition hover:text-cyan-300" to="/vendedor/dashboard">
            Vendedor
          </Link>
          <Link className="transition hover:text-red-300" to="/admin/dashboard">
            Admin
          </Link>
          <Link className="transition hover:text-cyan-300" to="/login">
            Iniciar sesión
          </Link>
        </nav>
      </div>
    </header>
  )
}

export default Navbar
