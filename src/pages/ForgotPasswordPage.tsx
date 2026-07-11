import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Page } from '@/components/ui/Page'
import { Button } from '@/components/ui/button'
import { InlineError } from '@/components/ui/InlineError'
import { AuthFormField } from '@/components/auth/AuthFormField'
import { useAuth } from '@/hooks/useAuth'
import { ForgotPasswordFormSchema } from '@/schemas/auth'
import type { AuthFieldErrors, AuthFormSubmitHandler } from '@/types/auth'

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState<AuthFieldErrors>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit: AuthFormSubmitHandler = async (e) => {
    e.preventDefault()
    setErrors({})
    setServerError(null)

    const parsed = ForgotPasswordFormSchema.safeParse({ email })
    if (!parsed.success) {
      const fieldErrors: AuthFieldErrors = {}
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0])
        if (!fieldErrors[key]) fieldErrors[key] = issue.message
      }
      setErrors(fieldErrors)
      return
    }

    setSubmitting(true)
    const result = await resetPassword(parsed.data.email)
    setSubmitting(false)
    if (result.ok) {
      setSuccess(true)
    } else {
      setServerError(result.error ?? 'Ismeretlen hiba.')
    }
  }

  if (success) {
    return (
      <Page constrained className="pt-20">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-foreground">Email elkuldve</h1>
          <p className="text-sm text-muted-foreground">
            Ha letezik fiok a(z) <strong>{email}</strong> cimmel,
            kuldtunk egy jelszo-visszaallito linket.
          </p>
          <Link to="/login" className="text-primary hover:underline text-sm">
            Vissza a bejelentkezeshez
          </Link>
        </div>
      </Page>
    )
  }

  return (
    <Page constrained className="pt-20">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">Elfelejtett jelszo</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Add meg az email cimed es kuldunk egy visszaallito linket
          </p>
        </div>

        {serverError && <InlineError message={serverError} />}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <AuthFormField
            id="email"
            label="Email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={setEmail}
            error={errors.email}
            disabled={submitting}
          />
          <Button
            type="submit"
            disabled={submitting}
            className="w-full h-10"
          >
            {submitting ? 'Kuldes...' : 'Visszaallito link kuldese'}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          <Link to="/login" className="text-primary hover:underline">
            Vissza a bejelentkezeshez
          </Link>
        </p>
      </div>
    </Page>
  )
}
