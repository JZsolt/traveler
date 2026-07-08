import type { HeroAccommodationTextField, HeroDraft, HeroEditorProps } from '@/types/components'

export function TripHeroEditor({ draft, onChange }: HeroEditorProps) {
  function set<K extends keyof HeroDraft>(field: K, value: HeroDraft[K]) {
    onChange({ ...draft, [field]: value })
  }

  function setAccom(field: HeroAccommodationTextField, value: string) {
    onChange({ ...draft, accom: { ...draft.accom, [field]: value } })
  }

  function setWifi(field: 'name' | 'password', value: string) {
    onChange({
      ...draft,
      accom: {
        ...draft.accom,
        wifi: {
          name: draft.accom.wifi?.name || '',
          password: draft.accom.wifi?.password || '',
          [field]: value,
        },
      },
    })
  }

  function setFlight(field: keyof HeroDraft['flight'], value: string) {
    onChange({ ...draft, flight: { ...draft.flight, [field]: value } })
  }

  const inputClass = "w-full border border-white/30 bg-white/10 rounded-lg px-3 py-1.5 text-sm text-white placeholder:text-white/40"

  return (
    <div className="max-w-md mx-auto space-y-4 text-left">
      <div className="flex items-center gap-2">
        <input type="text" value={draft.emoji} onChange={e => set('emoji', e.target.value)} className="w-14 border border-white/30 bg-white/10 rounded-lg px-2 py-1.5 text-center text-2xl text-white" />
        <input type="text" value={draft.title} onChange={e => set('title', e.target.value)} placeholder="Utazás neve *" className="flex-1 min-w-0 border border-white/30 bg-white/10 rounded-lg px-3 py-1.5 text-base text-white placeholder:text-white/40" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <label className="block">
          <span className="text-xs text-white/60">Indulás</span>
          <input type="date" value={draft.startDate} onChange={e => set('startDate', e.target.value)} className={inputClass} />
        </label>
        <label className="block">
          <span className="text-xs text-white/60">Érkezés</span>
          <input type="date" value={draft.endDate} onChange={e => set('endDate', e.target.value)} className={inputClass} />
        </label>
      </div>
      <input type="text" value={draft.people} onChange={e => set('people', e.target.value)} placeholder="Utazók (pl. 4 felnőtt, 2 gyerek)" className={inputClass} />

      <div className="border-t border-white/20 pt-3 space-y-2">
        <p className="text-xs text-white/60 font-medium">🏠 Szállás</p>
        <input type="text" value={draft.accom.address} onChange={e => setAccom('address', e.target.value)} placeholder="Cím" className={inputClass} />
        <input type="url" value={draft.accom.mapUrl} onChange={e => setAccom('mapUrl', e.target.value)} placeholder="Térkép URL" className={inputClass} />
        <input type="text" value={draft.accom.host} onChange={e => setAccom('host', e.target.value)} placeholder="Házigazda" className={inputClass} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <input type="text" value={draft.accom.gateCode} onChange={e => setAccom('gateCode', e.target.value)} placeholder="Kapu kód" className={inputClass} />
          <input type="text" value={draft.accom.doorCode} onChange={e => setAccom('doorCode', e.target.value)} placeholder="Bejárat kód" className={inputClass} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <input type="text" value={draft.accom.wifi?.name || ''} onChange={e => setWifi('name', e.target.value)} placeholder="WiFi név" className={inputClass} />
          <input type="text" value={draft.accom.wifi?.password || ''} onChange={e => setWifi('password', e.target.value)} placeholder="WiFi jelszó" className={inputClass} />
        </div>
      </div>

      <div className="border-t border-white/20 pt-3 space-y-2">
        <p className="text-xs text-white/60 font-medium">🚀 Közlekedés</p>
        <input type="text" value={draft.flight.airport} onChange={e => setFlight('airport', e.target.value)} placeholder="Reptér / közlekedés (pl. BUD → FCO, vagy Autó)" className={inputClass} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <input type="text" value={draft.flight.arrival} onChange={e => setFlight('arrival', e.target.value)} placeholder="Érkezés (pl. 10:30)" className={inputClass} />
          <input type="text" value={draft.flight.departure} onChange={e => setFlight('departure', e.target.value)} placeholder="Indulás (pl. 18:00)" className={inputClass} />
        </div>
      </div>
    </div>
  )
}
