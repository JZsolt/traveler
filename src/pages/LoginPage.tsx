import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Page } from '@/components/ui/Page'
import { Button } from '@/components/ui/button'
import { InlineError } from '@/components/ui/InlineError'
import { AuthFormField } from '@/components/auth/AuthFormField'
import { useAuth } from '@/hooks/useAuth'
import { LoginFormSchema } from '@/schemas/auth'
import { getLocationFrom } from '@/types/guards'
import type { LoginFormData } from '@/types/auth'

export default function LoginPage() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = getLocationFrom(location.state)
  const [serverError, setServerError] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>({
    resolver: zodResolver(LoginFormSchema),
  })

  async function onSubmit(data: LoginFormData) {
    setServerError(null)
    const result = await signIn(data.email, data.password)
    if (result.ok) {
      navigate(from, { replace: true })
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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <AuthFormField
            label="Email"
            type="email"
            autoComplete="email"
            registration={register('email')}
            error={errors.email?.message}
            disabled={isSubmitting}
          />
          <AuthFormField
            label="Jelszo"
            type="password"
            autoComplete="current-password"
            registration={register('password')}
            error={errors.password?.message}
            disabled={isSubmitting}
          />
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-10"
          >
            {isSubmitting ? 'Bejelentkezes...' : 'Bejelentkezes'}
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
