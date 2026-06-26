export function PackingList({ items }) {
  if (!items?.length) return null
  return (
    <div>
      <h2 className="text-base md:text-lg font-bold border-b-2 border-[#e94560] pb-1 mb-3">🎒 Csomagolási emlékeztető</h2>
      <ul className="space-y-1.5">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-xs py-1 border-b border-slate-100">
            <span className="text-base">☐</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
