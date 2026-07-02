import { useState, useEffect, useRef } from 'react'
import { SquarePen } from 'lucide-react'
import { useTripUpdater } from '@/hooks/useTripUpdater'
import { formatDateRange } from '@/lib/dateUtils'
import { Button } from '@/components/ui/button'

function getTransportEmoji(airport = '') {
  const lower = airport.toLowerCase()
  if (lower.includes('autó') || lower.includes('auto')) return '🚗'
  if (lower.includes('vonat')) return '🚆'
  if (lower.includes('busz')) return '🚌'
  if (lower.includes('komp') || lower.includes('hajó')) return '⛴️'
  return '✈️'
}

function hasAccommodationData(a) {
  if (!a) return false
  return !!(a.host || a.address || a.gateCode || a.doorCode || a.wifi || a.videos?.length)
}

function HeroEditor({ draft, onChange }) {
  function set(field, value) {
    onChange({ ...draft, [field]: value })
  }

  function setAccom(field, value) {
    onChange({ ...draft, accom: { ...draft.accom, [field]: value } })
  }

  function setWifi(field, value) {
    onChange({
      ...draft,
      accom: {
        ...draft.accom,
        wifi: { ...(draft.accom.wifi || {}), [field]: value },
      },
    })
  }

  function setFlight(field, value) {
    onChange({ ...draft, flight: { ...draft.flight, [field]: value } })
  }

  const inputClass = "w-full border border-white/30 bg-white/10 rounded-lg px-3 py-1.5 text-sm text-white placeholder:text-white/40"

  return (
    <div className="max-w-md mx-auto space-y-4 text-left">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={draft.emoji}
          onChange={e => set('emoji', e.target.value)}
          className="w-14 border border-white/30 bg-white/10 rounded-lg px-2 py-1.5 text-center text-2xl text-white"
        />
        <input
          type="text"
          value={draft.title}
          onChange={e => set('title', e.target.value)}
          placeholder="Utazás neve *"
          className="flex-1 min-w-0 border border-white/30 bg-white/10 rounded-lg px-3 py-1.5 text-base text-white placeholder:text-white/40"
        />
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
      <input
        type="text"
        value={draft.people}
        onChange={e => set('people', e.target.value)}
        placeholder="Utazók (pl. 4 felnőtt, 2 gyerek)"
        className={inputClass}
      />

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

export function TripHero({ trip, slug, refetch, editRef }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(null)
  const [validationError, setValidationError] = useState(null)
  const [confirmCancel, setConfirmCancel] = useState(false)
  const initialDraft = useRef(null)
  const { saveTrip, saving, error } = useTripUpdater({ trip, slug, refetch })

  function handleEdit() {
    const a = trip.accommodation || {}
    const f = trip.flight || {}
    const d = {
      title: trip.title || '',
      emoji: trip.emoji || '',
      people: trip.people || '',
      startDate: trip.startDate || '',
      endDate: trip.endDate || '',
      accom: {
        address: a.address || '',
        mapUrl: a.mapUrl || '',
        host: a.host || '',
        gateCode: a.gateCode || '',
        doorCode: a.doorCode || '',
        wifi: a.wifi ? { name: a.wifi.name || '', password: a.wifi.password || '' } : null,
      },
      flight: {
        airport: f.airport || '',
        arrival: f.arrival || '',
        departure: f.departure || '',
      },
    }
    initialDraft.current = JSON.stringify(d)
    setDraft(d)
    setEditing(true)
  }

  useEffect(() => {
    if (editRef) editRef.current = { edit: handleEdit }
  })

  function handleCancel() {
    const isDirty = draft && JSON.stringify(draft) !== initialDraft.current
    if (isDirty && !confirmCancel) {
      setConfirmCancel(true)
      return
    }
    setDraft(null)
    setValidationError(null)
    setConfirmCancel(false)
    setEditing(false)
  }

  async function handleSave() {
    if (!draft.title?.trim()) {
      setValidationError('Az utazás neve kötelező.')
      return { ok: false }
    }
    setValidationError(null)

    const subtitle = formatDateRange(draft.startDate, draft.endDate)

    const existing = trip.accommodation || {}
    const wifi = (draft.accom.wifi?.name || draft.accom.wifi?.password)
      ? { name: draft.accom.wifi?.name || '', password: draft.accom.wifi?.password || '' }
      : undefined
    const accommodation = {
      ...existing,
      address: draft.accom.address,
      mapUrl: draft.accom.mapUrl,
      host: draft.accom.host,
      gateCode: draft.accom.gateCode,
      doorCode: draft.accom.doorCode,
    }
    if (wifi) {
      accommodation.wifi = wifi
    } else {
      delete accommodation.wifi
    }

    const flight = {
      ...(trip.flight || {}),
      airport: draft.flight.airport,
      arrival: draft.flight.arrival,
      departure: draft.flight.departure,
    }

    const result = await saveTrip(t => ({
      ...t,
      title: draft.title,
      emoji: draft.emoji,
      people: draft.people,
      startDate: draft.startDate,
      endDate: draft.endDate,
      subtitle: subtitle || t.subtitle,
      accommodation,
      flight,
    }))
    if (result.ok) {
      setDraft(null)
      setEditing(false)
    }
    return result
  }

  return (
    <div className="bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] text-white py-12 md:py-16 px-6 text-center relative group/hero">
      {editing ? (
        <>
          <p className="text-3xl md:text-5xl mb-3">{draft.emoji || '🌍'}</p>
          <HeroEditor draft={draft} onChange={setDraft} />
          {(validationError || error) && (
            <p className="text-xs text-red-300 mt-2">{validationError || error}</p>
          )}
          <div className="flex items-center justify-center gap-2 mt-4">
            <Button
              onClick={handleSave}
              disabled={saving}
              size="sm"
              className="bg-[#e94560] hover:bg-[#d63d56] text-white"
            >
              {saving ? 'Mentés...' : 'Mentés'}
            </Button>
            {confirmCancel ? (
              <>
                <span className="text-xs text-yellow-300">Nem mentett módosítások elvesznek.</span>
                <Button onClick={handleCancel} variant="ghost" size="sm" className="border border-red-400/50 text-red-300 hover:bg-red-500/20">
                  Elvetés
                </Button>
                <Button onClick={() => setConfirmCancel(false)} variant="ghost" size="sm" className="border border-white/30 text-white hover:bg-white/10">
                  Vissza
                </Button>
              </>
            ) : (
              <Button
                onClick={handleCancel}
                disabled={saving}
                variant="ghost"
                size="sm"
                className="border border-white/30 text-white hover:bg-white/10"
              >
                Mégse
              </Button>
            )}
          </div>
        </>
      ) : (
        <>
          <p className="text-3xl md:text-5xl mb-3">{trip.emoji}</p>
          <h1 className="text-xl md:text-3xl font-extrabold tracking-tight mb-2">{trip.title}</h1>
          <p className="text-sm opacity-80 mb-4">A tökéletes kirándulás útiterve</p>
          <div className="inline-block bg-[#e94560] px-6 py-2.5 rounded-full text-sm md:text-base font-semibold mb-4">
            {trip.subtitle}
          </div>
          <div className="text-xs md:text-sm opacity-70 max-w-md mx-auto space-y-2">
            <p>👥 {trip.people}</p>
            {trip.accommodation?.address && (
              <p>
                🏠 Szállás:{' '}
                <a href={trip.accommodation.mapUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 text-white/90 hover:text-white">
                  {trip.accommodation.address}
                </a>
              </p>
            )}
            {trip.flight?.airport && (
              <p>{getTransportEmoji(trip.flight.airport)} {trip.flight.airport} · Érkezés {trip.flight.arrival} → Indulás {trip.flight.departure}</p>
            )}
            {trip.budget?.headline && (
              <p>💰 Büdzsé: {trip.budget.headline}</p>
            )}
          </div>

          {hasAccommodationData(trip.accommodation) && (
            <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-xl p-4 max-w-md mx-auto text-left text-xs md:text-sm space-y-2">
              <p className="text-center font-semibold text-sm mb-3">🏠 Szállás infó</p>
              {trip.accommodation.host && <p>👤 Házigazda: {trip.accommodation.host}</p>}
              {trip.accommodation.gateCode && <p>🔑 Kapu kód: <span className="font-mono bg-white/20 px-1.5 py-0.5 rounded">{trip.accommodation.gateCode}</span></p>}
              {trip.accommodation.doorCode && <p>🚪 Bejárat kód: <span className="font-mono bg-white/20 px-1.5 py-0.5 rounded">{trip.accommodation.doorCode}</span></p>}
              {trip.accommodation.wifi && (
                <p>📶 WiFi: <span className="font-mono bg-white/20 px-1.5 py-0.5 rounded">{trip.accommodation.wifi.name}</span> · Jelszó: <span className="font-mono bg-white/20 px-1.5 py-0.5 rounded">{trip.accommodation.wifi.password}</span></p>
              )}
              {trip.accommodation.videos && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {trip.accommodation.videos.map((video, i) => (
                    <a key={i} href={video.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 bg-[#e94560] hover:bg-[#d63d56] px-3 py-1.5 rounded-full text-xs font-medium transition-colors">
                      ▶ {video.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
