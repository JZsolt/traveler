import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Page } from '@/components/ui/Page'
import { Button } from '@/components/ui/button'
import { InlineError } from '@/components/ui/InlineError'
import { AuthFormField } from '@/components/auth/AuthFormField'
import { useAuth } from '@/hooks/useAuth'
import { ForgotPasswordFormSchema } from '@/schemas/auth'
import type { ForgotPasswordFormData } from '@/types/auth'

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth()
  const [serverError, setServerError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [sentEmail, setSentEmail] = useState('')

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(ForgotPasswordFormSchema),
  })

  async function onSubmit(data: ForgotPasswordFormData) {
    setServerError(null)
    const result = await resetPassword(data.email)
    if (result.ok) {
      setSentEmail(data.email)
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
            Ha letezik fiok a(z) <strong>{sentEmail}</strong> cimmel,
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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <AuthFormField
            label="Email"
            type="email"
            autoComplete="email"
            registration={register('email')}
            error={errors.email?.message}
            disabled={isSubmitting}
          />
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-10"
          >
            {isSubmitting ? 'Kuldes...' : 'Visszaallito link kuldese'}
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
