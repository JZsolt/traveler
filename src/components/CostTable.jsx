export function CostTable({ costs }) {
  return (
    <div className="overflow-x-auto mt-4">
      <table className="w-full text-[12px] md:text-[13px]">
        <thead>
          <tr>
            <th className="bg-[#1a1a2e] text-white p-2.5 text-left font-semibold rounded-tl-xl">Tétel</th>
            <th className="bg-[#1a1a2e] text-white p-2.5 text-right font-semibold rounded-tr-xl whitespace-nowrap">Összesen (5 fő)</th>
          </tr>
        </thead>
        <tbody>
          {costs.map((c, i) => (
            <tr key={i} className={c.total ? 'bg-[#e94560]/5' : 'border-b border-slate-100'}>
              <td className={`p-2 ${c.total ? 'font-bold text-[#1a1a2e]' : 'text-slate-600'}`}>{c.item}</td>
              <td className={`p-2 text-right whitespace-nowrap ${c.total ? 'font-bold text-[#e94560] text-[14px]' : c.cost === 'INGYENES' ? 'text-emerald-600 font-semibold' : 'text-slate-700'}`}>{c.cost}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-[10px] text-slate-400 mt-1.5 text-right">* Becsült költség az 5 fő (2 család + 1 gyerek) együttesen / nap</p>
    </div>
  )
}
