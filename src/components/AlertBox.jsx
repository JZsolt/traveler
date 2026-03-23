export function AlertBox({ type, text, url }) {
  const styles = {
    tip: 'bg-emerald-50 border-l-3 border-emerald-500 text-emerald-900',
    warning: 'bg-amber-50 border-l-3 border-amber-500 text-amber-900',
    urgent: 'bg-red-50 border-l-3 border-[#e94560] text-red-900'
  }

  return (
    <div className={`${styles[type] || styles.tip} p-3.5 rounded-r-xl my-3 text-[12px] md:text-[13px] leading-[1.6] whitespace-pre-line`}>
      {text}
      {url && (
        <>
          {' '}
          <a href={url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 font-semibold hover:opacity-70 transition-opacity">
            Foglalás →
          </a>
        </>
      )}
    </div>
  )
}
