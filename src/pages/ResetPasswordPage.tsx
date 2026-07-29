import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Page } from '@/components/ui/Page'
import { Button } from '@/components/ui/button'
import { InlineError } from '@/components/ui/InlineError'
import { AuthFormField } from '@/components/auth/AuthFormField'
import { supabase } from '@/lib/supabase'
import { ResetPasswordFormSchema } from '@/schemas/auth'
import { mapAuthError } from '@/lib/authErrors'
import type { ResetPasswordFormData } from '@/types/auth'

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const [serverError, setServerError] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(ResetPasswordFormSchema),
  })

  async function onSubmit(data: ResetPasswordFormData) {
    setServerError(null)

    if (!supabase) {
      setServerError('Supabase nincs konfigurálva.')
      return
    }

    const { error } = await supabase.auth.updateUser({ password: data.password })
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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <AuthFormField
            label="Uj jelszo"
            type="password"
            autoComplete="new-password"
            registration={register('password')}
            error={errors.password?.message}
            disabled={isSubmitting}
          />
          <AuthFormField
            label="Jelszo megerositese"
            type="password"
            autoComplete="new-password"
            registration={register('confirmPassword')}
            error={errors.confirmPassword?.message}
            disabled={isSubmitting}
          />
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-10"
          >
            {isSubmitting ? 'Mentes...' : 'Jelszo mentese'}
          </Button>
        </form>
      </div>
    </Page>
  )
}
