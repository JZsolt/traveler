import { X } from 'lucide-react'
import type { DayImagesProps } from '@/types/components'

export function DayImages({ images, lightbox, onOpen, onClose }: DayImagesProps) {
  if (!images?.length && !lightbox) return null

  return (
    <>
      {images && images.length > 0 && (
        <div className="grid grid-cols-3 gap-1.5 md:gap-2.5 mt-3 mb-4">
          {images.map((img, i) => (
            <div key={i} className="overflow-hidden rounded-xl bg-slate-200 cursor-pointer" onClick={() => onOpen(img)}>
              <img src={img.url} alt={img.caption} className="w-full h-24 md:h-36 object-cover hover:scale-105 transition-all duration-300" loading="lazy" decoding="async" fetchPriority={i === 0 ? 'high' : 'low'} onLoad={e => (e.target as HTMLImageElement).style.opacity = '1'} style={{ opacity: 0, transition: 'opacity 0.3s' }} />
              <p className="text-center text-[9px] md:text-[10px] text-slate-400 mt-1 px-1">{img.caption}</p>
            </div>
          ))}
        </div>
      )}

      {lightbox && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex flex-col items-center justify-center p-4" onClick={onClose}>
          <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white cursor-pointer z-10" style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}>
            <X className="w-7 h-7" />
          </button>
          <img src={lightbox.url} alt={lightbox.caption} className="max-w-full max-h-[80vh] object-contain rounded-lg" />
          <p className="text-white/80 text-sm mt-3 text-center">{lightbox.caption}</p>
        </div>
      )}
    </>
  )
}
