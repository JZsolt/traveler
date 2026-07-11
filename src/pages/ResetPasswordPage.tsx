import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Page } from '@/components/ui/Page'
import { Button } from '@/components/ui/button'
import { InlineError } from '@/components/ui/InlineError'
import { AuthFormField } from '@/components/auth/AuthFormField'
import { supabase } from '@/lib/supabase'
import { ResetPasswordFormSchema } from '@/schemas/auth'
import { mapAuthError } from '@/lib/authErrors'
import type { AuthFieldErrors, AuthFormSubmitHandler } from '@/types/auth'

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState<AuthFieldErrors>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit: AuthFormSubmitHandler = async (e) => {
    e.preventDefault()
    setErrors({})
    setServerError(null)

    const parsed = ResetPasswordFormSchema.safeParse({ password, confirmPassword })
    if (!parsed.success) {
      const fieldErrors: AuthFieldErrors = {}
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0])
        if (!fieldErrors[key]) fieldErrors[key] = issue.message
      }
      setErrors(fieldErrors)
      return
    }

    if (!supabase) {
      setServerError('Supabase nincs konfigurálva.')
      return
    }

    setSubmitting(true)
    const { error } = await supabase.auth.updateUser({ password: parsed.data.password })
    setSubmitting(false)

    if (error) {
      setServerError(mapAuthError(error))
      return
    }

    navigate('/app/trips', { replace: true })
  }

  return (
    <Page constrained className="pt-20">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">Uj jelszo beallitasa</h1>
          <p className="text-sm text-muted-foreground mt-1">Add meg az uj jelszavad</p>
        </div>

        {serverError && <InlineError message={serverError} />}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <AuthFormField
            id="password"
            label="Uj jelszo"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={setPassword}
            error={errors.password}
            disabled={submitting}
          />
          <AuthFormField
            id="confirmPassword"
            label="Jelszo megerositese"
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            error={errors.confirmPassword}
            disabled={submitting}
          />
          <Button
            type="submit"
            disabled={submitting}
            className="w-full h-10"
          >
            {submitting ? 'Mentes...' : 'Jelszo mentese'}
          </Button>
        </form>
      </div>
    </Page>
  )
}
