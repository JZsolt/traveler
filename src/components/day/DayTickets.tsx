import { Ticket } from 'lucide-react'
import type { DayTicketsProps } from '@/types/components'

export function DayTickets({ tickets }: DayTicketsProps) {
  if (!tickets?.length) return null

  return (
    <div className="flex flex-wrap gap-2 mt-3 mb-2">
      {tickets.map((ticket, i) => (
        <a key={i} href={ticket.pdf} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl px-3.5 py-2.5 transition-colors no-underline">
          <Ticket className="w-4 h-4 text-emerald-600 shrink-0" />
          <div className="min-w-0">
            <span className="block text-xs font-semibold text-emerald-800">{ticket.label}</span>
            <span className="block text-[10px] text-emerald-600/70">{ticket.desc}</span>
          </div>
        </a>
      ))}
    </div>
  )
}
