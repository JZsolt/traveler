import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Page } from '@/components/ui/Page'
import { Button } from '@/components/ui/button'
import { InlineError } from '@/components/ui/InlineError'
import { AuthFormField } from '@/components/auth/AuthFormField'
import { useAuth } from '@/hooks/useAuth'
import { RegisterFormSchema } from '@/schemas/auth'
import type { RegisterFormData } from '@/types/auth'

export default function RegisterPage() {
  const { signUp } = useAuth()
  const [serverError, setServerError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [registeredEmail, setRegisteredEmail] = useState('')

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterFormSchema),
  })

  async function onSubmit(data: RegisterFormData) {
    setServerError(null)
    const name = data.displayName?.trim() || undefined
    const result = await signUp(data.email, data.password, name)
    if (result.ok) {
      setRegisteredEmail(data.email)
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
            Kuldtunk egy megerosito emailt a(z) <strong>{registeredEmail}</strong> cimre.
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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <AuthFormField
            label="Nev (opcionalis)"
            type="text"
            autoComplete="name"
            registration={register('displayName')}
            error={errors.displayName?.message}
            disabled={isSubmitting}
          />
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
            autoComplete="new-password"
            registration={register('password')}
            error={errors.password?.message}
            disabled={isSubmitting}
          />
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-10"
          >
            {isSubmitting ? 'Regisztracio...' : 'Regisztracio'}
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
