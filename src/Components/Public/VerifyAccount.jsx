import { Link } from 'react-router'
import BackgroundPage from '../Background/backgroundPage'

function VerifyAccount() {
  return (
    <BackgroundPage>
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="w-full max-w-lg text-center">
          <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-indigo-400/10">
            <svg className="h-10 w-10 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-white">Verifica tu cuenta</h1>
          <p className="mt-4 text-lg text-slate-300">
            Hemos enviado un correo de verificación a tu bandeja institucional.
          </p>
          <p className="mt-2 text-sm text-slate-400">
            Revisa tu correo y haz clic en el enlace de verificación para activar tu cuenta.
            Si no lo encuentras, revisa la carpeta de spam o correo no deseado.
          </p>

          <div className="mt-8 space-y-3">
            <Link
              to="/login"
              className="inline-flex w-full items-center justify-center rounded-xl bg-indigo-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-indigo-300"
            >
              Ir a iniciar sesión
            </Link>
            <p className="text-xs text-slate-500">
              ¿No recibiste el correo?{' '}
              <button className="text-indigo-300 hover:text-indigo-200" onClick={() => {}}>
                Reenviar verificación
              </button>
            </p>
          </div>
        </div>
      </div>
    </BackgroundPage>
  )
}

export default VerifyAccount
