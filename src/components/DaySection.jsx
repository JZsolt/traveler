import { useState } from 'react'
import { ChevronDown, X } from 'lucide-react'
import { ScheduleItem } from './ScheduleItem'
import { CostTable } from './CostTable'
import { AlertBox } from './AlertBox'
import { TransportOptions } from './TransportOptions'

export function DaySection({ day, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
  const [lightbox, setLightbox] = useState(null)

  return (
    <div className="border-b border-slate-200/60">
      <button
        onClick={() => setOpen(!open)}
        className="w-full cursor-pointer"
      >
        <div className="bg-gradient-to-r from-[#1a1a2e] to-[#0f3460] text-white p-4 md:p-5 rounded-2xl mx-3 md:mx-8 my-2.5 flex items-center gap-4 hover:opacity-95 transition-opacity active:scale-[0.99]">
          <div className="bg-[#e94560] w-11 h-11 md:w-14 md:h-14 rounded-full flex items-center justify-center text-lg md:text-xl font-extrabold shrink-0">
            {day.dayNum}
          </div>
          <div className="flex-1 text-left">
            <h2 className="text-[15px] md:text-lg font-bold leading-tight">{day.title}</h2>
            <p className="text-[11px] md:text-xs opacity-60 mt-0.5">{day.subtitle}</p>
          </div>
          <ChevronDown
            className={`w-5 h-5 opacity-40 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          />
        </div>
      </button>

      {open && (
        <div className="px-4 md:px-12 pb-5">
          {/* Images */}
          {day.images?.length > 0 && (
            <div className="grid grid-cols-3 gap-1.5 md:gap-2.5 mt-3 mb-4">
              {day.images.map((img, i) => (
                <div key={i} className="overflow-hidden rounded-xl bg-slate-200 cursor-pointer" onClick={() => setLightbox(img)}>
                  <img
                    src={img.url}
                    alt={img.caption}
                    className="w-full h-24 md:h-36 object-cover hover:scale-105 transition-all duration-300"
                    loading="lazy"
                    decoding="async"
                    fetchPriority={i === 0 ? 'high' : 'low'}
                    onLoad={(e) => e.target.style.opacity = 1}
                    style={{ opacity: 0, transition: 'opacity 0.3s' }}
                  />
                  <p className="text-center text-[9px] md:text-[10px] text-slate-400 mt-1 px-1">{img.caption}</p>
                </div>
              ))}
            </div>
          )}

          {/* Lightbox */}
          {lightbox && (
            <div className="fixed inset-0 z-[100] bg-black/90 flex flex-col items-center justify-center p-4" onClick={() => setLightbox(null)}>
              <button onClick={() => setLightbox(null)} className="absolute top-4 right-4 text-white/70 hover:text-white cursor-pointer z-10" style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}>
                <X className="w-7 h-7" />
              </button>
              <img src={lightbox.url} alt={lightbox.caption} className="max-w-full max-h-[80vh] object-contain rounded-lg" />
              <p className="text-white/80 text-sm mt-3 text-center">{lightbox.caption}</p>
            </div>
          )}

          {/* Alerts */}
          {day.alerts?.map((alert, i) => (
            <AlertBox key={i} type={alert.type} text={alert.text} />
          ))}

          {/* Transport options */}
          {day.transportOptions && (
            <TransportOptions data={day.transportOptions} />
          )}

          {/* Schedule */}
          <div>
            {day.schedule.map((item, i) => (
              <ScheduleItem key={i} item={item} />
            ))}
          </div>

          {/* Costs */}
          {day.costs && <CostTable costs={day.costs} />}

          {/* End alerts */}
          {day.endAlerts?.map((alert, i) => (
            <AlertBox key={i} type={alert.type} text={alert.text} url={alert.url} />
          ))}
        </div>
      )}
    </div>
  )
}
