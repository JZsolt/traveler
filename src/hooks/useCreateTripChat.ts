import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { friendlyError } from '@/lib/friendlyError'
import { ensureUniqueSlug } from '@/lib/ensureUniqueSlug'
import { draftToTripData } from '@/lib/createTripHelpers'
import { API } from '@/lib/constants'
import type { ChatMessage } from '@/types/api'
import type { Draft } from '@/types/createTrip'
import type { CreateTripChatProps, CreateTripChatReturn } from '@/types/hooks'
import { isDraft } from '@/types/guards'

function isObjectWithKey(val: unknown, key: string): val is Record<string, unknown> {
  return typeof val === 'object' && val !== null && key in val
}

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
        if (isObjectWithKey(data, 'reply') && typeof data.reply === 'string') {
          const reply = data.reply
          setMessages(prev => [...prev, { role: 'assistant', content: reply }])
        } else {
          const errMsg = isObjectWithKey(data, 'error') && typeof data.error === 'string' ? data.error : ''
          setAiError(friendlyError(errMsg))
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
        const errMsg = isObjectWithKey(data, 'error') && typeof data.error === 'string' ? data.error : ''
        setAiError(friendlyError(errMsg))
      } else if (isObjectWithKey(data, 'reply') && typeof data.reply === 'string') {
        const reply = data.reply
        setMessages(prev => [...prev, { role: 'assistant', content: reply }])
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

      if (res.status === 429 || (isObjectWithKey(data, 'retryable') && data.retryable)) {
        const errMsg = isObjectWithKey(data, 'error') && typeof data.error === 'string' ? data.error : ''
        setAiError(friendlyError(errMsg))
        setIs429(true)
        return
      }

      if (!res.ok) {
        const errMsg = isObjectWithKey(data, 'error') && typeof data.error === 'string' ? data.error : ''
        setAiError(friendlyError(errMsg))
        return
      }

      if (!isObjectWithKey(data, 'trip') || !isDraft(data.trip)) {
        setAiError('Hibas valasz a szervertol.')
        return
      }

      const tripResult = data.trip
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

      const { error: insertError } = await supabase
        .from('trips')
        .insert({ slug, trip_data: tripData, owner: null })

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
