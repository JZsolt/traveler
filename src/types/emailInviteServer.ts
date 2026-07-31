export interface TripInviteEmailEventInsert {
  owner_id: string
  trip_id: string
  recipient_email: string
  status: string
}

export interface EmailProviderPayload {
  from: string
  to: string[]
  subject: string
  html: string
  text: string
}
