import axios from 'axios'
import { supabase } from './supabase'
import { isRecord } from '@/types/guards'

export const apiClient = axios.create({
  headers: { 'Content-Type': 'application/json' },
})

apiClient.interceptors.request.use(async (config) => {
  if (!supabase) return config
  const { data: { session } } = await supabase.auth.getSession()
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`
  }
  return config
})

const NETWORK_ERROR = 'Nem sikerult kapcsolodni a szerverhez.'
const FALLBACK_ERROR = 'Varatlan hiba tortent. Probald ujra kesobb.'

export function mapApiError(error: unknown): string {
  if (!axios.isAxiosError(error)) return FALLBACK_ERROR
  if (!error.response) return NETWORK_ERROR
  const data: unknown = error.response.data
  if (!isRecord(data)) return FALLBACK_ERROR
  if (!isRecord(data.error)) return FALLBACK_ERROR
  return typeof data.error.message === 'string' ? data.error.message : FALLBACK_ERROR
}
