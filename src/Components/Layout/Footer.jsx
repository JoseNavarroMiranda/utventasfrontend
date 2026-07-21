import { Link } from 'react-router'

function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-950">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-6 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <div>
          <p>© 2026 UTVentas</p>
          <p className="mt-0.5">Compra y vende entre estudiantes de forma segura.</p>
        </div>
        <div className="flex gap-4">
          <Link to="/privacidad" className="transition hover:text-white">Aviso de Privacidad</Link>
          <Link to="/terminos" className="transition hover:text-white">Términos de Servicio</Link>
        </div>
      </div>
    </footer>
  )
}

export default Footer