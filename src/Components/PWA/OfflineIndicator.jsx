import { useState, useEffect } from 'react'

function OfflineIndicator() {
  const [online, setOnline] = useState(navigator.onLine)

  useEffect(() => {
    const goOnline = () => setOnline(true)
    const goOffline = () => setOnline(false)
    window.addEventListener('online', goOnline)
    window.addEventListener('offline', goOffline)
    return () => {
      window.removeEventListener('online', goOnline)
      window.removeEventListener('offline', goOffline)
    }
  }, [])

  if (online) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] bg-red-500/90 backdrop-blur px-4 py-2 text-center text-sm font-medium text-white animate-slide-down">
      <span className="inline-block h-2 w-2 rounded-full bg-white mr-2 animate-pulse" />
      Sin conexión a internet — los cambios podrían no guardarse
    </div>
  )
}

export default OfflineIndicator
