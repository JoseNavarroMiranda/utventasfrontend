import { useState } from 'react'

function ImageCarousel({ images = [], productName = 'Producto' }) {
  const [current, setCurrent] = useState(0)
  const hasImages = images.length > 0

  const placeholderColors = [
    'from-blue-500/40 to-cyan-400/40',
    'from-purple-500/40 to-pink-400/40',
    'from-emerald-500/40 to-teal-400/40',
    'from-orange-500/40 to-red-400/40',
  ]

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900">
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-800">
        {hasImages ? (
          <img
            src={images[current]}
            alt={`${productName} - imagen ${current + 1}`}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${placeholderColors[current % placeholderColors.length]}`}>
            <div className="text-center">
              <svg className="mx-auto h-16 w-16 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="mt-2 text-sm text-white/40">Sin imagen</p>
            </div>
          </div>
        )}

        {hasImages && images.length > 1 && (
          <>
            <button
              onClick={() => setCurrent((p) => (p === 0 ? images.length - 1 : p - 1))}
              className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center rounded-full bg-black/50 p-3 text-white transition hover:bg-black/70 min-h-[44px] min-w-[44px]"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button
              onClick={() => setCurrent((p) => (p === images.length - 1 ? 0 : p + 1))}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center rounded-full bg-black/50 p-3 text-white transition hover:bg-black/70 min-h-[44px] min-w-[44px]"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </>
        )}
      </div>

      <div className="flex items-center justify-center gap-2 px-4 py-3">
          {(hasImages ? images : placeholderColors).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2 rounded-full transition ${
                i === current ? 'w-6 bg-cyan-400' : 'w-2 bg-slate-600 hover:bg-slate-500'
              }`}
            />
          ))}
        </div>
    </div>
  )
}

export default ImageCarousel
