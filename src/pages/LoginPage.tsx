import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Page } from '@/components/ui/Page'
import { Button } from '@/components/ui/button'
import { InlineError } from '@/components/ui/InlineError'
import { AuthFormField } from '@/components/auth/AuthFormField'
import { useAuth } from '@/hooks/useAuth'
import { LoginFormSchema } from '@/schemas/auth'
import type { AuthFieldErrors, AuthFormSubmitHandler } from '@/types/auth'

export default function LoginPage() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<AuthFieldErrors>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit: AuthFormSubmitHandler = async (e) => {
    e.preventDefault()
    setErrors({})
    setServerError(null)

    const parsed = LoginFormSchema.safeParse({ email, password })
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
    const result = await signIn(parsed.data.email, parsed.data.password)
    setSubmitting(false)
    if (result.ok) {
      navigate('/app/trips', { replace: true })
    } else {
      setServerError(result.error ?? 'Ismeretlen hiba.')
    }
  }

  return (
    <Page constrained className="pt-20">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">Bejelentkezes</h1>
          <p className="text-sm text-muted-foreground mt-1">Jelentkezz be a fiokodba</p>
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
          <AuthFormField
            id="password"
            label="Jelszo"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={setPassword}
            error={errors.password}
            disabled={submitting}
          />
          <Button
            type="submit"
            disabled={submitting}
            className="w-full h-10"
          >
            {submitting ? 'Bejelentkezes...' : 'Bejelentkezes'}
          </Button>
        </form>

        <div className="text-center space-y-2 text-sm">
          <Link to="/forgot-password" className="text-primary hover:underline block">
            Elfelejtett jelszo
          </Link>
          <p className="text-muted-foreground">
            Meg nincs fiokod?{' '}
            <Link to="/register" className="text-primary hover:underline">
              Regisztracio
            </Link>
          </p>
        </div>
      </div>
    </Page>
  )
}
