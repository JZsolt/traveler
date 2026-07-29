// Public brand sav a megosztott (anonim) nezethez. Szandekosan NINCS benne
// owner/admin vezerlo: nincs beallitasok link, nincs app-navigacio, nincs
// trip breadcrumb. Csak a marka + egy "megosztott utiterv" jelzes. A magassaga
// (h-14) megegyezik az app Headerrel, igy a Page felso paddingje passzol.
export function SharedHeader() {
  return (
    <>
      <div
        className="fixed top-0 left-0 right-0 z-50 bg-[#1a1a2e]"
        style={{ height: 'env(safe-area-inset-top, 0px)' }}
      />
      <header
        className="fixed left-0 right-0 z-50 bg-[#1a1a2e] text-white h-14 flex items-center justify-between px-4 shadow-lg"
        style={{ top: 'env(safe-area-inset-top, 0px)' }}
      >
        <div className="flex items-center gap-2 font-bold text-base tracking-tight text-white">
          <span className="text-xl">✈️</span>
          <span>Az Utazásaim</span>
        </div>
        <span className="text-xs text-white/50">Megosztott útiterv</span>
      </header>
    </>
  )
}
