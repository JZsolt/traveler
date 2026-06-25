export function PracticalInfo({ sections }) {
  if (!sections) return null

  return (
    <div>
      <h2 className="text-base md:text-lg font-bold border-b-2 border-[#e94560] pb-1 mb-3">ℹ️ Praktikus infók</h2>
      <div className="space-y-3">
        {sections.map((section, i) => (
          <details key={i} className="group">
            <summary className="flex items-center justify-between cursor-pointer bg-slate-100 hover:bg-slate-200 transition-colors px-3 py-2.5 rounded-lg text-[13px] md:text-[14px] font-medium text-slate-700 list-none">
              <span>{section.title}</span>
              <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <ul className="mt-1.5 space-y-1 pl-3">
              {section.items.map((item, j) => (
                <li key={j} className="text-[12px] md:text-[13px] text-slate-600 leading-[1.65] list-disc marker:text-slate-300 ml-2">{item}</li>
              ))}
            </ul>
          </details>
        ))}
      </div>
    </div>
  )
}
