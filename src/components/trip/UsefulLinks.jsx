import { ExternalLink } from 'lucide-react'

export function UsefulLinks({ links }) {
  if (!links?.length) return null
  return (
    <div>
      <h2 className="text-base md:text-lg font-bold border-b-2 border-[#e94560] pb-1 mb-3">🔗 Hasznos linkek</h2>
      <div className="space-y-1.5">
        {links.map((link, i) => (
          <a
            key={i}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors no-underline text-[#1a1a2e]"
          >
            <span className="text-xl shrink-0">{link.emoji}</span>
            <div className="flex-1 min-w-0">
              <strong className="block text-xs">{link.name}</strong>
              <span className="text-[10px] text-gray-500">{link.desc}</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 opacity-30 shrink-0" />
          </a>
        ))}
      </div>
    </div>
  )
}
