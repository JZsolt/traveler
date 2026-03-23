import { Badge } from '@/components/ui/badge'
import { MapPin } from 'lucide-react'
import { GuideInfo } from './GuideInfo'

function extractLocationName(url) {
  if (!url) return null
  try {
    const qMatch = url.match(/[?&]q=([^&]+)/)
    if (qMatch) return decodeURIComponent(qMatch[1]).replace(/\+/g, ' ')
    const dirMatch = url.match(/\/dir\/[^/]+\/([^/?]+)/)
    if (dirMatch) return decodeURIComponent(dirMatch[1]).replace(/\+/g, ' ')
  } catch { /* ignore */ }
  return null
}

export function ScheduleItem({ item }) {
  const mapLink = item.links?.find(l => l.label.includes('Térkép') || l.label.includes('📍'))
  const otherLinks = item.links?.filter(l => l !== mapLink)
  const locationName = mapLink ? extractLocationName(mapLink.url) : null

  return (
    <div className={`flex gap-1 py-3 ${item.highlight ? 'bg-amber-50/60 px-4 -mx-4 border-l-3 border-amber-400' : 'border-b border-slate-100/80'}`}>
      {/* Time — fixed left column */}
      <span className="text-[11px] md:text-[12px] text-slate-400 font-semibold tabular-nums shrink-0 w-[42px] md:w-[48px] pt-0.5">{item.time}</span>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Title + Badges */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="font-bold text-[15px] md:text-[16px] text-slate-800 leading-snug">{item.title}</span>
          {item.badges?.map(b => (
            <Badge key={b} variant="outline" className={`text-[9px] font-semibold py-0 px-1.5 rounded-md ${
              b === 'INGYENES' ? 'bg-emerald-500 text-white border-emerald-500' :
              b === 'GYEREKBARÁT' || b === 'JÁTSZÓTÉR' ? 'bg-amber-500 text-white border-amber-500' :
              'bg-slate-100 text-slate-600'
            }`}>
              {b}
            </Badge>
          ))}
          {item.optional && <span className="text-[10px] text-slate-400 italic">(opcionális)</span>}
        </div>

        {/* Location + Transport — grouped under title */}
        {(locationName || item.transport) && (
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {locationName && (
              <a href={mapLink.url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1 text-[11px] md:text-[12px] text-blue-600 hover:text-blue-800 transition-colors no-underline select-all px-2 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 min-h-[32px]">
                <MapPin className="w-3.5 h-3.5 shrink-0 fill-white stroke-blue-600 stroke-[2.5]" />
                <span>{locationName}</span>
              </a>
            )}
            {item.transport?.map((t, i) => (
              <a key={i} href={t.url} target="_blank" rel="noopener noreferrer"
                className={`flex items-center text-[11px] md:text-[12px] font-medium px-2 py-1.5 rounded-lg no-underline min-h-[32px] transition-colors ${
                  t.type === 'transit'
                    ? 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                    : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
                }`}>
                {t.label}
              </a>
            ))}
          </div>
        )}

        {/* Description */}
        {item.desc && (
          <p className="text-[12px] md:text-[13px] text-slate-600 leading-[1.65]">{item.desc}</p>
        )}

        {/* Links */}
        {otherLinks?.length > 0 && (
          <div className="mt-1.5 flex flex-wrap gap-2">
            {otherLinks.map((link, i) => (
              <a key={i} href={link.url} target="_blank" rel="noopener noreferrer"
                className="text-[#0f3460] text-[11px] md:text-[12px] underline underline-offset-2 hover:text-[#e94560] transition-colors">
                {link.label}
              </a>
            ))}
          </div>
        )}

        {/* Guide */}
        {item.guide && <GuideInfo guide={item.guide} />}
      </div>
    </div>
  )
}
