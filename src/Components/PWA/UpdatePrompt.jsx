import { useRegisterSW } from 'virtual:pwa-register/react'

function UpdatePrompt() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW registrado:', r)
    },
    onRegisterError(error) {
      console.error('Error al registrar SW:', error)
    },
  })

  const close = () => {
    setOfflineReady(false)
    setNeedRefresh(false)
  }

  if (!offlineReady && !needRefresh) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 sm:left-auto sm:right-4 sm:max-w-sm animate-slide-up">
      <div className="rounded-2xl border border-white/10 bg-slate-900 p-4 shadow-2xl shadow-black/50">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cyan-400/10">
            <svg className="h-5 w-5 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-white">
              {offlineReady
                ? 'App lista para usar sin conexión'
                : 'Nueva versión disponible'}
            </p>
            <p className="mt-0.5 text-xs text-slate-400">
              {offlineReady
                ? 'Los archivos se han cacheado correctamente'
                : 'Actualiza para obtener los últimos cambios'}
            </p>
          </div>
        </div>
        <div className="mt-3 flex justify-end gap-2">
          <button
            onClick={close}
            className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-white/5"
          >
            Cerrar
          </button>
          {needRefresh && (
            <button
              onClick={() => updateServiceWorker(true)}
              className="rounded-lg bg-cyan-400 px-3 py-1.5 text-xs font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              Actualizar
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default UpdatePrompt
