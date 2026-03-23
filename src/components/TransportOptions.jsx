export function TransportOptions({ data }) {
  return (
    <div className="mt-2">
      <h3 className="text-xs md:text-sm font-bold mb-2">{data.title}</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-[10px] md:text-xs">
          <thead>
            <tr className="bg-slate-100">
              <th className="p-1.5 text-left font-semibold">Opció</th>
              <th className="p-1.5 text-left font-semibold">Idő</th>
              <th className="p-1.5 text-left font-semibold">Ár/fő retúr</th>
              <th className="p-1.5 text-left font-semibold">5 fő retúr</th>
              <th className="p-1.5 text-left font-semibold">Link</th>
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
                    Foglalás
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
