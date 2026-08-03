import { useState } from 'react'

function ImageCarousel({ images = [], productName = 'Producto' }) {
  const [current, setCurrent] = useState(0)
  const hasImages = images.length > 0

  const goTo = (i) => setCurrent(i)

  return (
    <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-white/10 bg-slate-800">
      {hasImages ? (
        <img
          src={images[current]}
          alt={`${productName} - imagen ${current + 1}`}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-500/40 to-cyan-400/40">
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
            onClick={() => goTo(current === 0 ? images.length - 1 : current - 1)}
            className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center rounded-full bg-black/50 p-3 text-white transition hover:bg-black/70 min-h-[44px] min-w-[44px]"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button
            onClick={() => goTo(current === images.length - 1 ? 0 : current + 1)}
            className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center rounded-full bg-black/50 p-3 text-white transition hover:bg-black/70 min-h-[44px] min-w-[44px]"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        </>
      )}
    </div>
  )
}

export default ImageCarousel