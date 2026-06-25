export function BookingChecklist({ items }) {
  return (
    <div>
      <h2 className="text-base md:text-lg font-bold border-b-2 border-[#e94560] pb-1 mb-3">☐ Foglalási checklist</h2>
      <ul className="space-y-1.5">
        {items.map((item, i) => (
          <li key={i} className={`flex items-start gap-2 text-xs py-1.5 border-b border-slate-100 ${item.done ? 'opacity-60' : ''}`}>
            <span className="text-base">{item.done ? '✅' : '☐'}</span>
            <span>
              <strong className={item.done ? 'line-through' : ''}>{item.item}</strong>
              {item.url && !item.done && (
                <>
                  {' → '}
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-[#0f3460] underline">
                    Foglalás
                  </a>
                </>
              )}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
