import { ExternalLink, ShieldCheck } from 'lucide-react'
import type { InsuranceLinkProps } from '@/types/components'

export function InsuranceLink({ insurance }: InsuranceLinkProps) {
  if (!insurance) return null

  const documents = insurance.documents?.length ? insurance.documents : [insurance]

  return (
    <div className="mt-4 space-y-2">
      {documents.map(document => (
        <a
          key={document.pdf}
          href={document.pdf}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl hover:bg-emerald-100 transition-colors no-underline text-[#1a1a2e]"
        >
          <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" aria-hidden="true" />
          <div className="flex-1 min-w-0">
            <strong className="block text-xs">{document.label}</strong>
            <span className="text-[10px] text-gray-500">{document.desc}</span>
          </div>
          <ExternalLink className="w-3.5 h-3.5 opacity-30 shrink-0" />
        </a>
      ))}
    </div>
  )
}
