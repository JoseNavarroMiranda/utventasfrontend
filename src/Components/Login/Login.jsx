import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router'
import { loginUser } from '../../store/slices/authSlice'
import BackgroundPage from '../Background/backgroundPage'
import Button from '../Shared/Button'

function Login() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error } = useSelector((s) => s.auth)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await dispatch(loginUser({ email, password }))
    if (result.meta.requestStatus === 'fulfilled') {
      navigate('/ventas')
    }
  }

  return (
    <BackgroundPage>
      <section className="flex min-h-screen w-full items-stretch justify-between">
        <aside className="relative hidden h-screen w-[50vw] min-w-[380px] overflow-hidden lg:flex lg:items-center lg:justify-center p-0">
          <div className="px-8 pl-16 text-left">
            <div className="typing-group text-white">
              <h2 className="text-[11rem] font-extrabold tracking-tight leading-none">
                UTVentas
              </h2>
              <p className="mt-6 text-[3.25rem] font-medium leading-snug">
                Vende rápido. Compra seguro.
                <br />
                Conecta con tu campus.
              </p>
            </div>
          </div>
        </aside>

        <div className="flex min-h-screen w-full items-center justify-center px-6 py-10 sm:px-10 lg:flex-1 lg:pl-16 lg:pr-12">
          <div className="w-full max-w-xl rounded-3xl px-8 py-12 backdrop-blur-md sm:px-12 sm:py-14 lg:min-h-[78vh] lg:py-16">
            <header className="mb-8">
              <h1 className="mt-2 text-3xl font-bold text-white">Inicia sesión</h1>
            </header>

            {error && (
              <div className="mb-4 rounded-xl bg-red-400/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-slate-100">Correo institucional</span>
                <input
                  type="email"
                  placeholder="tu-correo@utv.edu.mx"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                  required
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-slate-100">Contraseña</span>
                <input
                  type="password"
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                  required
                />
              </label>

              <Button
                type="submit"
                loading={loading}
                className="w-full"
              >
                Entrar
              </Button>
            </form>

            <footer className="mt-6 flex items-center justify-between text-sm text-slate-200">
              <Link className="font-medium text-indigo-300 hover:text-indigo-200" to="/recuperar-password">
                ¿Olvidaste tu contraseña?
              </Link>
              <Link className="font-medium text-indigo-300 hover:text-indigo-200" to="/registro">
                Crear cuenta
              </Link>
            </footer>
          </div>
        </div>
      </section>
    </BackgroundPage>
  )
}

export default Login
