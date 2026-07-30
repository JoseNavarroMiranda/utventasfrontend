import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router'
import { sendVerificationCode, registerUser } from '../../store/slices/authSlice'
import BackgroundPage from '../Background/backgroundPage'
import Button from '../Shared/Button'
import BackButton from '../Shared/BackButton'

const ROLES = [
  { value: 'vendedor', label: 'Vendedor', desc: 'Quiero vender productos' },
  { value: 'comprador', label: 'Comprador', desc: 'Quiero comprar productos' },
]

function Register() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error } = useSelector((s) => s.auth)

  const [step, setStep] = useState('form')
  const [form, setForm] = useState({
    nombre: '',
    correo: '',
    password: '',
    confirmPassword: '',
    rol_nombre: 'vendedor',
    codigo: '',
  })
  const [validationError, setValidationError] = useState('')

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setValidationError('')
  }

  const handleSendCode = async (e) => {
    e.preventDefault()
    setValidationError('')

    const correoCompleto = form.correo.includes('@') ? form.correo : `${form.correo}@soy.utj.edu.mx`

    if (!form.nombre.trim()) {
      setValidationError('El nombre es obligatorio')
      return
    }
    if (!correoCompleto.endsWith('@soy.utj.edu.mx')) {
      setValidationError('Debes usar un correo institucional @soy.utj.edu.mx')
      return
    }
    if (form.password.length < 6) {
      setValidationError('La contraseña debe tener al menos 6 caracteres')
      return
    }
    if (form.password !== form.confirmPassword) {
      setValidationError('Las contraseñas no coinciden')
      return
    }

    const result = await dispatch(sendVerificationCode(correoCompleto))
    if (result.meta.requestStatus === 'fulfilled') {
      setForm((prev) => ({ ...prev, correo: correoCompleto }))
      setStep('verify')
    }
  }

  const handleVerify = async (e) => {
    e.preventDefault()
    setValidationError('')

    if (!form.codigo.trim()) {
      setValidationError('Ingresa el código de verificación')
      return
    }

    const result = await dispatch(registerUser({
      nombre: form.nombre,
      correo: form.correo,
      password: form.password,
      rol_nombre: form.rol_nombre,
      codigo: form.codigo,
    }))

    if (result.meta.requestStatus === 'fulfilled') {
      const rol = result.payload?.rol
      const homeMap = { Administrador: '/admin/dashboard', Vendedor: '/vendedor/dashboard', Comprador: '/comprador/dashboard' }
      navigate(homeMap[rol] || '/')
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
          <div className="w-full max-w-xl rounded-3xl px-8 py-12 backdrop-blur-md sm:px-12 sm:py-14">
            <BackButton to="/" />
            <header className="mb-8">
              <h1 className="mt-2 text-3xl font-bold text-white">
                {step === 'form' ? 'Crear cuenta' : 'Verificar código'}
              </h1>
              <p className="mt-2 text-sm text-slate-300">
                {step === 'form'
                  ? 'Usa tu correo institucional @soy.utj.edu.mx'
                  : `Hemos enviado un código a ${form.correo}`}
              </p>
            </header>

            {(error || validationError) && (
              <div className="mb-4 rounded-xl bg-red-400/10 px-4 py-3 text-sm text-red-300">
                {validationError || error}
              </div>
            )}

            {step === 'form' ? (
              <form onSubmit={handleSendCode} className="space-y-5">
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-slate-100">Nombre completo</span>
                  <input
                    type="text"
                    name="nombre"
                    placeholder="Tu nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                    required
                  />
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-slate-100">Correo institucional</span>
                  <input
                    type="text"
                    name="correo"
                    placeholder="2123300393"
                    value={form.correo}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                    required
                  />
                  <span className="mt-1 text-xs text-slate-400">@soy.utj.edu.mx</span>
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-slate-100">Contraseña</span>
                  <input
                    type="password"
                    name="password"
                    placeholder="Mínimo 6 caracteres"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
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
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                    required
                  />
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-slate-100">Tipo de cuenta</span>
                  <div className="grid grid-cols-2 gap-3">
                    {ROLES.map((r) => (
                      <button
                        key={r.value}
                        type="button"
                        onClick={() => setForm((prev) => ({ ...prev, rol_nombre: r.value }))}
                        className={`rounded-xl border px-4 py-3 text-left transition ${
                          form.rol_nombre === r.value
                            ? 'border-indigo-400 bg-indigo-400/10 text-white'
                            : 'border-slate-600 bg-white/5 text-slate-300 hover:border-slate-400'
                        }`}
                      >
                        <span className="block text-sm font-semibold">{r.label}</span>
                        <span className="block text-xs text-slate-400">{r.desc}</span>
                      </button>
                    ))}
                  </div>
                </label>

                <p className="text-xs text-slate-400">
                  Al registrarte aceptas nuestros{' '}
                  <Link to="/terminos" className="text-indigo-300 hover:text-indigo-200">Términos de Servicio</Link>
                  {' '}y{' '}
                  <Link to="/privacidad" className="text-indigo-300 hover:text-indigo-200">Aviso de Privacidad</Link>
                </p>

                <Button type="submit" loading={loading} className="w-full">
                  Enviar código de verificación
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerify} className="space-y-5">
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-slate-100">Código de verificación</span>
                  <input
                    type="text"
                    name="codigo"
                    placeholder="Ingresa el código de 6 dígitos"
                    value={form.codigo}
                    onChange={handleChange}
                    maxLength={6}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-center text-2xl tracking-widest text-base text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                    required
                  />
                </label>

                <Button type="submit" loading={loading} className="w-full">
                  Verificar y crear cuenta
                </Button>

                <button
                  type="button"
                  onClick={() => setStep('form')}
                  className="w-full text-center text-sm text-slate-400 transition hover:text-slate-200"
                >
                  Volver atrás
                </button>
              </form>
            )}

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
