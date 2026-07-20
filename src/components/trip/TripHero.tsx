import { useState, useEffect, useRef } from 'react'
import { SquarePen } from 'lucide-react'
import { useTripUpdater } from '@/hooks/useTripUpdater'
import { formatDateRange } from '@/lib/dateUtils'
import { Button } from '@/components/ui/button'
import { DirtyCancelRow } from '@/components/editor/DirtyCancelRow'
import { AccommodationInfo } from './AccommodationInfo'
import { TripHeroEditor } from './TripHeroEditor'
import type { Accommodation, Flight } from '@/types/trip'
import type { HeroDraft, TripHeroProps } from '@/types/components'

function getTransportEmoji(airport = '') {
  const lower = airport.toLowerCase()
  if (lower.includes('autó') || lower.includes('auto')) return '🚗'
  if (lower.includes('vonat')) return '🚆'
  if (lower.includes('busz')) return '🚌'
  if (lower.includes('komp') || lower.includes('hajó')) return '⛴️'
  return '✈️'
}

export function TripHero({ trip, slug, refetch, editRef }: TripHeroProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState<HeroDraft | null>(null)
  const [validationError, setValidationError] = useState<string | null>(null)
  const [confirmCancel, setConfirmCancel] = useState(false)
  const initialDraft = useRef<string | null>(null)
  const { saveTrip, saving, error } = useTripUpdater({ trip, slug, refetch })

  function handleEdit() {
    const a: Accommodation = trip.accommodation || {}
    const f: Flight = trip.flight || {}
    const d: HeroDraft = {
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
    if (!draft) return { ok: false }
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
    const accommodation: Accommodation = {
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

    const flight: Flight = {
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
      {editing && draft ? (
        <>
          <p className="text-3xl md:text-5xl mb-3">{draft.emoji || '🌍'}</p>
          <TripHeroEditor draft={draft} onChange={setDraft} />
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
              <DirtyCancelRow show onDiscard={handleCancel} onDismiss={() => setConfirmCancel(false)} dark />
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

          <AccommodationInfo accommodation={trip.accommodation} />
        </>
      )}
    </div>
  )
}
