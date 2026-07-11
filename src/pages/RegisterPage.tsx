import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Page } from '@/components/ui/Page'
import { Button } from '@/components/ui/button'
import { InlineError } from '@/components/ui/InlineError'
import { AuthFormField } from '@/components/auth/AuthFormField'
import { useAuth } from '@/hooks/useAuth'
import { RegisterFormSchema } from '@/schemas/auth'
import type { AuthFieldErrors, AuthFormSubmitHandler } from '@/types/auth'

export default function RegisterPage() {
  const { signUp } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [errors, setErrors] = useState<AuthFieldErrors>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit: AuthFormSubmitHandler = async (e) => {
    e.preventDefault()
    setErrors({})
    setServerError(null)

    const parsed = RegisterFormSchema.safeParse({
      email,
      password,
      displayName: displayName || undefined,
    })
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
    const result = await signUp(parsed.data.email, parsed.data.password, parsed.data.displayName)
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
          <h1 className="text-2xl font-bold text-foreground">Ellenorizd az emailed</h1>
          <p className="text-sm text-muted-foreground">
            Kuldtunk egy megerosito emailt a(z) <strong>{email}</strong> cimre.
            Kattints a linkre az aktivalashoz.
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
          <h1 className="text-2xl font-bold text-foreground">Regisztracio</h1>
          <p className="text-sm text-muted-foreground mt-1">Hozd letre a fiokod</p>
        </div>

        {serverError && <InlineError message={serverError} />}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <AuthFormField
            id="displayName"
            label="Nev (opcionalis)"
            type="text"
            autoComplete="name"
            value={displayName}
            onChange={setDisplayName}
            error={errors.displayName}
            disabled={submitting}
          />
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
            autoComplete="new-password"
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
            {submitting ? 'Regisztracio...' : 'Regisztracio'}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Mar van fiokod?{' '}
          <Link to="/login" className="text-primary hover:underline">
            Bejelentkezes
          </Link>
        </p>
      </div>
    </Page>
  )
}
