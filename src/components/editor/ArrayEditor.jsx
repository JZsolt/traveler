export function ArrayEditor({ items, onChange, placeholder, renderItem }) {
  function update(index, value) {
    const updated = [...items]
    updated[index] = value
    onChange(updated)
  }
  function remove(index) { onChange(items.filter((_, i) => i !== index)) }
  function moveUp(index) {
    if (index === 0) return
    const updated = [...items]
    ;[updated[index - 1], updated[index]] = [updated[index], updated[index - 1]]
    onChange(updated)
  }
  function moveDown(index) {
    if (index >= items.length - 1) return
    const updated = [...items]
    ;[updated[index], updated[index + 1]] = [updated[index + 1], updated[index]]
    onChange(updated)
  }
  return (
    <div className="space-y-1">
      {items.map((item, i) => (
        <div key={i} className="flex items-start gap-1">
          <div className="flex-1 min-w-0">{renderItem(item, v => update(i, v))}</div>
          <button onClick={() => moveUp(i)} disabled={i === 0} aria-label="Fel" className="text-[9px] text-gray-400 hover:text-gray-700 disabled:opacity-20 p-0.5">▲</button>
          <button onClick={() => moveDown(i)} disabled={i >= items.length - 1} aria-label="Le" className="text-[9px] text-gray-400 hover:text-gray-700 disabled:opacity-20 p-0.5">▼</button>
          <button onClick={() => remove(i)} aria-label="Törlés" className="text-[9px] text-red-400 hover:text-red-600 p-0.5">✕</button>
        </div>
      ))}
      <button onClick={() => onChange([...items, typeof placeholder === 'function' ? placeholder() : placeholder])} className="text-[10px] text-[#0f3460] hover:underline">+ Hozzáadás</button>
    </div>
  )
}
