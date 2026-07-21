import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router'
import { registerUser } from '../../store/slices/authSlice'
import BackgroundPage from '../Background/backgroundPage'
import Button from '../Shared/Button'

const INSTITUTIONAL_DOMAIN = '@utj.edu.mx'

function Register() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error } = useSelector((s) => s.auth)

  const [form, setForm] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [validationError, setValidationError] = useState('')

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setValidationError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setValidationError('')

    if (!form.email.toLowerCase().endsWith(INSTITUTIONAL_DOMAIN)) {
      setValidationError(`Debes usar un correo institucional ${INSTITUTIONAL_DOMAIN}`)
      return
    }
    if (form.password.length < 8) {
      setValidationError('La contraseña debe tener al menos 8 caracteres')
      return
    }
    if (form.password !== form.confirmPassword) {
      setValidationError('Las contraseñas no coinciden')
      return
    }

    const result = await dispatch(
      registerUser({ nombre: form.nombre, email: form.email, password: form.password })
    )
    if (result.meta.requestStatus === 'fulfilled') {
      navigate('/verificar')
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
                Únete a la comunidad.
                <br />
                Compra y vende seguro.
              </p>
            </div>
          </div>
        </aside>

        <div className="flex min-h-screen w-full items-center justify-center px-6 py-10 sm:px-10 lg:flex-1 lg:pl-16 lg:pr-12">
          <div className="w-full max-w-xl rounded-3xl px-8 py-12 backdrop-blur-md sm:px-12 sm:py-14 lg:min-h-[78vh] lg:py-16">
            <header className="mb-8">
              <h1 className="mt-2 text-3xl font-bold text-white">Crear cuenta</h1>
              <p className="mt-2 text-sm text-slate-300">
                Usa tu correo institucional {INSTITUTIONAL_DOMAIN} para registrarte
              </p>
            </header>

            {(error || validationError) && (
              <div className="mb-4 rounded-xl bg-red-400/10 px-4 py-3 text-sm text-red-300">
                {validationError || error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-slate-100">Nombre completo</span>
                <input
                  type="text"
                  name="nombre"
                  placeholder="Tu nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                  required
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-slate-100">Correo institucional</span>
                <input
                  type="email"
                  name="email"
                  placeholder={`tu-correo${INSTITUTIONAL_DOMAIN}`}
                  value={form.email}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                  required
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-slate-100">Contraseña</span>
                <input
                  type="password"
                  name="password"
                  placeholder="Mínimo 8 caracteres"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                  required
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-slate-100">Confirmar contraseña</span>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Repite tu contraseña"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                  required
                />
              </label>

              <p className="text-xs text-slate-400">
                Al registrarte aceptas nuestros{' '}
                <Link to="/terminos" className="text-indigo-300 hover:text-indigo-200">Términos de Servicio</Link>
                {' '}y{' '}
                <Link to="/privacidad" className="text-indigo-300 hover:text-indigo-200">Aviso de Privacidad</Link>
              </p>

              <Button type="submit" loading={loading} className="w-full">
                Crear cuenta
              </Button>
            </form>

            <footer className="mt-6 text-center text-sm text-slate-200">
              ¿Ya tienes cuenta?{' '}
              <Link className="font-medium text-indigo-300 hover:text-indigo-200" to="/login">
                Inicia sesión
              </Link>
            </footer>
          </div>
        </div>
      </section>
    </BackgroundPage>
  )
}

export default Register
