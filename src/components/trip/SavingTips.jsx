export function SavingTips({ tips, label }) {
  return (
    <div>
      <h2 className="text-base md:text-lg font-bold border-b-2 border-[#e94560] pb-1 mb-3">💰 Pénz-spórolási tippek</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-slate-100">
              <th className="p-2 text-left">#</th>
              <th className="p-2 text-left">Tipp</th>
              <th className="p-2 text-right">{label || 'Megtakarítás (5 fő)'}</th>
            </tr>
          </thead>
          <tbody>
            {tips.map((tip, i) => (
              <tr key={i} className="border-b border-slate-100">
                <td className="p-1.5">{i + 1}</td>
                <td className="p-1.5">{tip.tip}</td>
                <td className="p-1.5 text-right font-semibold">{tip.saving}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
