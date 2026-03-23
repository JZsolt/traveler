import { useState } from 'react'
import { ChevronDown, Landmark, Eye, Sparkles, Lightbulb, ExternalLink } from 'lucide-react'

const sections = {
  history: { icon: Landmark, label: 'Történelem', color: 'text-amber-700' },
  mustSee: { icon: Eye, label: 'Ezt nézd meg', color: 'text-rose-600' },
  funFacts: { icon: Sparkles, label: 'Érdekességek', color: 'text-violet-600' },
  tips: { icon: Lightbulb, label: 'Tippek', color: 'text-emerald-600' },
}

function GuideItem({ item }) {
  // Support both string and { text, url } format
  if (typeof item === 'string') {
    return <span>{item}</span>
  }
  return (
    <span>
      {item.text}
      {item.url && (
        <a href={item.url} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-0.5 ml-1 text-blue-500 hover:text-blue-700 transition-colors no-underline">
          <ExternalLink className="w-3 h-3" />
        </a>
      )}
    </span>
  )
}

export function GuideInfo({ guide }) {
  const [open, setOpen] = useState(false)

  if (!guide) return null
  const sectionEntries = Object.entries(guide).filter(([k, v]) => sections[k] && v?.length > 0)
  if (sectionEntries.length === 0 && !guide.image) return null

  return (
    <div className="mt-2">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer border-0 text-[12px] md:text-[13px] font-medium text-slate-500"
      >
        <span>📖 Részletek & háttérinfó</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="mt-2.5 space-y-3 bg-slate-50/80 rounded-xl p-3 md:p-4">
          {/* Optional guide image */}
          {guide.image && (
            <img
              src={guide.image.url}
              alt={guide.image.caption || ''}
              className="w-full h-40 md:h-52 object-cover rounded-lg"
              loading="lazy"
            />
          )}
          {guide.image?.caption && (
            <p className="text-[10px] text-slate-400 text-center -mt-2">{guide.image.caption}</p>
          )}

          {sectionEntries.map(([key, items]) => {
            const { icon: Icon, label, color } = sections[key]
            return (
              <div key={key}>
                <div className={`flex items-center gap-1.5 text-[11px] md:text-[12px] font-bold ${color} mb-1`}>
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </div>
                <ul className="space-y-0.5 ml-5">
                  {items.map((item, i) => (
                    <li key={i} className="text-[12px] md:text-[13px] text-slate-600 leading-[1.65] list-disc marker:text-slate-300">
                      <GuideItem item={item} />
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
