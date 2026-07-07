import { getPersonCount } from '@/lib/personCount'

export function TransportOptions({ data, people }) {
  const personCount = getPersonCount(people)
  const headers = data.headers || {
    option: 'Opció',
    time: 'Idő',
    pricePerPerson: 'Ár/fő retúr',
    total: `${personCount} fő retúr`,
    link: 'Link',
  }

  return (
    <div className="mt-2">
      <h3 className="text-xs md:text-sm font-bold mb-2">{data.title}</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-[10px] md:text-xs">
          <thead>
            <tr className="bg-slate-100">
              <th className="p-1.5 text-left font-semibold">{headers.option}</th>
              <th className="p-1.5 text-left font-semibold">{headers.time}</th>
              <th className="p-1.5 text-left font-semibold">{headers.pricePerPerson}</th>
              <th className="p-1.5 text-left font-semibold">{headers.total}</th>
              <th className="p-1.5 text-left font-semibold">{headers.link}</th>
            </tr>
          </thead>
          <tbody>
            {data.options.map((opt, i) => (
              <tr key={i} className={`border-b border-slate-100 ${opt.recommended ? 'bg-amber-50' : ''}`}>
                <td className="p-1.5 font-semibold">{opt.name}</td>
                <td className="p-1.5">{opt.time}</td>
                <td className="p-1.5">{opt.pricePerPerson}</td>
                <td className="p-1.5">{opt.total}</td>
                <td className="p-1.5">
                  <a href={opt.url} target="_blank" rel="noopener noreferrer" className="text-[#0f3460] underline">
                    {opt.linkLabel || data.linkLabel || 'Foglalás'}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
