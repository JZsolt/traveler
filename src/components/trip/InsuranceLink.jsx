import { ExternalLink } from 'lucide-react'

export function InsuranceLink({ insurance }) {
  if (!insurance) return null

  return (
    <a
      href={insurance.pdf}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl hover:bg-emerald-100 transition-colors no-underline text-[#1a1a2e] mt-4"
    >
      <span className="text-xl">🛡️</span>
      <div className="flex-1 min-w-0">
        <strong className="block text-xs">{insurance.label}</strong>
        <span className="text-[10px] text-gray-500">{insurance.desc}</span>
      </div>
      <ExternalLink className="w-3.5 h-3.5 opacity-30 shrink-0" />
    </a>
  )
}
