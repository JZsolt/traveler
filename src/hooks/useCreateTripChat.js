import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { friendlyError } from '@/lib/friendlyError'
import { ensureUniqueSlug } from '@/lib/ensureUniqueSlug'
import { draftToTripData } from '@/lib/createTripHelpers'
import { API } from '@/lib/constants'

export function useCreateTripChat({ form, aiModel, refetch, chatEndRef }) {
  const navigate = useNavigate()
  const [messages, setMessages] = useState([])
  const [chatInput, setChatInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [generatedTrip, setGeneratedTrip] = useState(null)
  const [aiError, setAiError] = useState(null)
  const [is429, setIs429] = useState(false)
  const [saving, setSaving] = useState(false)

  function scrollToEnd() {
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
  }

  function startChat(initialMessages) {
    setMessages(initialMessages)
    setChatLoading(true)

    fetch(API.CHAT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: initialMessages, model: aiModel }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.reply) {
          setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
        } else {
          setAiError(friendlyError(data.error))
        }
      })
      .catch(err => setAiError(friendlyError(err)))
      .finally(() => {
        setChatLoading(false)
        scrollToEnd()
      })
  }

  async function sendMessage() {
    const text = chatInput.trim()
    if (!text || generating || chatLoading) return
    const updated = [...messages, { role: 'user', content: text }]
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
      const data = await res.json()
      if (!res.ok) {
        setAiError(friendlyError(data.error))
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
      }
    } catch (err) {
      setAiError(friendlyError(err))
    } finally {
      setChatLoading(false)
      scrollToEnd()
    }
  }

  async function generate(detailLevel, instruction) {
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

      const data = await res.json()

      if (res.status === 429 || data.retryable) {
        setAiError(friendlyError(data.error))
        setIs429(true)
        return
      }

      if (!res.ok) {
        setAiError(friendlyError(data.error))
        return
      }

      setGeneratedTrip(data.trip)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Kesz a terv: ${data.trip.title} (${data.trip.days?.length || 0} nap). Nezd at az elonezetet lent!`,
      }])
    } catch (err) {
      setAiError(friendlyError(err))
    } finally {
      setGenerating(false)
      scrollToEnd()
    }
  }

  async function saveTrip() {
    if (!generatedTrip || saving) return
    setSaving(true)
    setAiError(null)

    try {
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
    saveTrip,
    reset,
  }
}
