export function BudgetSummary({ budget }) {
  const rows = [
    { amount: budget.lowPerFamily, label: budget.lowPerFamilyLabel || 'Spórolós / 1 család (2 fő + gyerek)' },
    { amount: budget.comfortPerFamily, label: budget.comfortPerFamilyLabel || 'Komfort / 1 család (2 fő + gyerek)' },
    { amount: budget.lowTotal, label: budget.lowTotalLabel || 'Spórolós / mind az 5 fő együtt' },
    { amount: budget.comfortTotal, label: budget.comfortTotalLabel || 'Komfort / mind az 5 fő együtt' }
  ]

  return (
    <div className="bg-gradient-to-r from-[#1a1a2e] to-[#0f3460] text-white p-5 rounded-2xl mt-5">
      <h3 className="text-sm md:text-base font-bold mb-1">💰 Költségvetés összesítő</h3>
      <p className="text-[10px] opacity-50 mb-3">
        {budget.summaryLabel || 'Teljes utazás (5 nap) becsült költségei — repjegy nélkül'}
      </p>
      <div className="grid grid-cols-2 gap-2.5">
        {rows.map((row, i) => (
          <div key={i} className="bg-white/10 p-3 rounded-xl text-center">
            <div className="text-lg md:text-2xl font-extrabold text-[#e94560]">{row.amount}</div>
            <div className="text-[10px] md:text-xs opacity-70 mt-1">{row.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
