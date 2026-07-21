import { useMemo } from 'react'

function generateQRDataUrl(token) {
  const size = 160
  const cellSize = 8
  const cells = Math.floor(size / cellSize)
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, size, size)
  ctx.fillStyle = '#000000'
  const hash = token.split('').reduce((acc, c) => ((acc << 5) - acc) + c.charCodeAt(0) | 0, 0)
  const seed = Math.abs(hash)
  for (let i = 0; i < cells * cells; i++) {
    const row = Math.floor(i / cells)
    const col = i % cells
    const pseudoRandom = ((seed * (i + 1) * 31) % 100) / 100
    if (pseudoRandom > 0.6) {
      ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize)
    }
  }
  const finderSize = cellSize * 7
  ctx.fillStyle = '#000000'
  ctx.fillRect(0, 0, finderSize, cellSize)
  ctx.fillRect(0, 0, cellSize, finderSize)
  ctx.fillRect(0, finderSize - cellSize, finderSize, cellSize)
  ctx.fillRect(finderSize - cellSize, 0, cellSize, finderSize)
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(cellSize, cellSize, cellSize * 5, cellSize * 5)
  ctx.fillStyle = '#000000'
  ctx.fillRect(cellSize * 2, cellSize * 2, cellSize * 3, cellSize * 3)
  return canvas.toDataURL()
}

function DeliveryToken({ token }) {
  const qrDataUrl = useMemo(() => {
    if (!token) return null
    try { return generateQRDataUrl(token) } catch { return null }
  }, [token])

  if (!token) return null

  return (
    <div className="rounded-2xl border border-blue-400/20 bg-blue-400/5 p-6 text-center">
      <p className="mb-4 text-sm font-medium text-blue-300">Código Antiestafas — Token de Entrega</p>
      <p className="mb-6 text-center text-sm text-slate-400">
        Muestra este código al vendedor para recibir tu producto en el campus
      </p>

      <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-center sm:gap-8">
        {qrDataUrl && (
          <div className="rounded-xl border border-white/10 bg-white p-2">
            <img src={qrDataUrl} alt="QR de entrega" className="h-36 w-36" />
          </div>
        )}

        <div className="flex flex-col items-center">
          <p className="mb-2 text-xs text-slate-400">O ingresa manualmente:</p>
          <p className="font-mono text-2xl font-bold tracking-widest text-white lg:text-3xl select-all">
            {token}
          </p>
        </div>
      </div>
    </div>
  )
}

export default DeliveryToken
