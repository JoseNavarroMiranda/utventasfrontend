import { Link } from 'react-router'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../../store/slices/authSlice'

function Navbar() {
  const dispatch = useDispatch()
  const { user } = useSelector((s) => s.auth)

  return (
    <header className="border-b border-white/10 bg-slate-950/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <Link to="/ventas" className="text-lg font-black tracking-tight text-white">
          UTVentas
        </Link>

        <nav className="flex items-center gap-4 text-sm text-slate-200">
          <Link className="transition hover:text-cyan-300" to="/ventas">
            Productos
          </Link>
          {user ? (
            <>
              <Link className="transition hover:text-cyan-300" to="/vendedor/dashboard">
                Vendedor
              </Link>
              <span className="text-slate-500">|</span>
              <span className="text-slate-400">{user.nombre || user.email}</span>
              <button
                onClick={() => dispatch(logout())}
                className="transition hover:text-red-400"
              >
                Salir
              </button>
            </>
          ) : (
            <Link className="transition hover:text-cyan-300" to="/login">
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Navbar
