import { useState } from 'react'
import { ChevronDown, Landmark, Eye, Sparkles, Lightbulb } from 'lucide-react'

const sections = {
  history: { icon: Landmark, label: 'Történelem', color: 'text-amber-700' },
  mustSee: { icon: Eye, label: 'Ezt nézd meg', color: 'text-rose-600' },
  funFacts: { icon: Sparkles, label: 'Érdekességek', color: 'text-violet-600' },
  tips: { icon: Lightbulb, label: 'Tippek', color: 'text-emerald-600' },
}

export function GuideInfo({ guide }) {
  const [open, setOpen] = useState(false)

  if (!guide) return null
  const entries = Object.entries(guide).filter(([, v]) => v?.length > 0)
  if (entries.length === 0) return null

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
          {entries.map(([key, items]) => {
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
                      {item}
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
