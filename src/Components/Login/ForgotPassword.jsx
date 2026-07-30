import BackgroundPage from '../Background/backgroundPage'
import BackButton from '../Shared/BackButton'

function ForgotPassword() {
  return (
    <BackgroundPage>
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="w-full max-w-lg">
          <BackButton to="/" />
          <div className="mt-4 rounded-3xl px-8 py-12 backdrop-blur-md sm:px-12">
            <h1 className="text-3xl font-bold text-white">Recuperar contraseña</h1>
            <p className="mt-2 text-sm text-slate-300">
              Ingresa tu correo institucional y te enviaremos instrucciones para restablecer tu contraseña.
            </p>
            <form className="mt-8 space-y-5">
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-slate-100">Correo institucional</span>
                <input
                  type="email"
                  placeholder="tu-correo@utv.edu.mx"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                  required
                />
              </label>
              <button
                type="submit"
                className="w-full rounded-xl bg-indigo-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-indigo-300"
              >
                Enviar instrucciones
              </button>
            </form>
          </div>
        </div>
      </div>
    </BackgroundPage>
  )
}

export default ForgotPassword
