import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { friendlyError } from '@/lib/friendlyError'
import { ensureUniqueSlug } from '@/lib/ensureUniqueSlug'
import { draftToTripData } from '@/lib/createTripHelpers'
import { API } from '@/lib/constants'
import { TripImportDataSchema } from '@/schemas/trip'
import { formatZodError } from '@/schemas/errors'
import {
  ChatReplyEnvelopeSchema, ChatErrorEnvelopeSchema, PlanTripEnvelopeSchema,
} from '@/schemas/ai'
import type { ChatMessage } from '@/types/api'
import type { Draft } from '@/types/createTrip'
import type { CreateTripChatProps, CreateTripChatReturn } from '@/types/hooks'

export function useCreateTripChat({ form, aiModel, refetch, chatEndRef }: CreateTripChatProps): CreateTripChatReturn {
  const navigate = useNavigate()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [chatInput, setChatInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [generatedTrip, setGeneratedTrip] = useState<Draft | null>(null)
  const [aiError, setAiError] = useState<string | null>(null)
  const [is429, setIs429] = useState(false)
  const [saving, setSaving] = useState(false)

  function scrollToEnd() {
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
  }

  function startChat(initialMessages: ChatMessage[]) {
    setMessages(initialMessages)
    setChatLoading(true)

    fetch(API.CHAT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: initialMessages, model: aiModel }),
    })
      .then(res => res.json())
      .then((data: unknown) => {
        const reply = ChatReplyEnvelopeSchema.safeParse(data)
        if (reply.success) {
          setMessages(prev => [...prev, { role: 'assistant', content: reply.data.reply }])
        } else {
          const err = ChatErrorEnvelopeSchema.safeParse(data)
          setAiError(friendlyError(err.success ? err.data.error : ''))
        }
      })
      .catch((err: unknown) => setAiError(friendlyError(err)))
      .finally(() => {
        setChatLoading(false)
        scrollToEnd()
      })
  }

  async function sendMessage() {
    const text = chatInput.trim()
    if (!text || generating || chatLoading) return
    const updated: ChatMessage[] = [...messages, { role: 'user', content: text }]
    setMessages(updated)
    setChatInput('')
    setAiError(null)
    setIs429(false)
    setChatLoading(true)
    scrollToEnd()

    try {
      const res = await fetch(API.CHAT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updated, model: aiModel }),
      })
      const data: unknown = await res.json()
      if (!res.ok) {
        const errEnv = ChatErrorEnvelopeSchema.safeParse(data)
        setAiError(friendlyError(errEnv.success ? errEnv.data.error : ''))
      } else {
        const reply = ChatReplyEnvelopeSchema.safeParse(data)
        if (reply.success) {
          setMessages(prev => [...prev, { role: 'assistant', content: reply.data.reply }])
        } else {
          setAiError('Hibas valasz a szervertol.')
        }
      }
    } catch (err) {
      setAiError(friendlyError(err))
    } finally {
      setChatLoading(false)
      scrollToEnd()
    }
  }

  async function generate(detailLevel: string, instruction?: string) {
    if (generating) return
    setGenerating(true)
    setAiError(null)
    setIs429(false)
    setGeneratedTrip(null)
    scrollToEnd()

    try {
      const res = await fetch(API.PLAN_TRIP, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages,
          detailLevel,
          model: aiModel,
          instruction: instruction?.trim() || undefined,
        }),
      })

      const data: unknown = await res.json()
      const errEnv = ChatErrorEnvelopeSchema.safeParse(data)

      if (res.status === 429 || (errEnv.success && errEnv.data.retryable)) {
        setAiError(friendlyError(errEnv.success ? errEnv.data.error : ''))
        setIs429(true)
        return
      }

      if (!res.ok) {
        setAiError(friendlyError(errEnv.success ? errEnv.data.error : ''))
        return
      }

      const envelope = PlanTripEnvelopeSchema.safeParse(data)
      if (!envelope.success) {
        setAiError('Hibas valasz a szervertol.')
        return
      }

      const tripResult = envelope.data.trip
      setGeneratedTrip(tripResult)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Kesz a terv: ${tripResult.title} (${tripResult.days?.length || 0} nap). Nezd at az elonezetet lent!`,
      }])
    } catch (err) {
      setAiError(friendlyError(err))
    } finally {
      setGenerating(false)
      scrollToEnd()
    }
  }

  async function saveGeneratedTrip() {
    if (!generatedTrip || saving) return
    setSaving(true)
    setAiError(null)

    try {
      if (!supabase) throw new Error('Supabase nincs konfigurálva.')

      const tripData = { ...draftToTripData(generatedTrip, form), aiModel }
      const baseSlug = tripData.slug
      if (!baseSlug) {
        setAiError('Nincs ervenyes slug.')
        return
      }

      const slug = await ensureUniqueSlug(baseSlug)
      tripData.slug = slug

      const validated = TripImportDataSchema.safeParse(tripData)
      if (!validated.success) {
        setAiError(`Ervenytelen utazas adat: ${formatZodError(validated.error)}`)
        return
      }

      const { error: insertError } = await supabase
        .from('trips')
        .insert({ slug, trip_data: validated.data, owner: null })

      if (insertError) {
        setAiError(friendlyError(insertError))
        return
      }

      await refetch()
      navigate(`/trip/${slug}`)
    } catch (err) {
      setAiError(friendlyError(err))
    } finally {
      setSaving(false)
    }
  }

  function reset() {
    setMessages([])
    setGeneratedTrip(null)
    setAiError(null)
    setIs429(false)
  }

  return {
    messages,
    chatInput,
    setChatInput,
    chatLoading,
    generating,
    generatedTrip,
    aiError,
    is429,
    saving,
    startChat,
    sendMessage,
    generate,
    saveTrip: saveGeneratedTrip,
    reset,
  }
}
