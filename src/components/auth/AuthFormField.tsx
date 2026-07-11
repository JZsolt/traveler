import { cn } from '@/lib/utils'
import type { AuthFormFieldProps } from '@/types/auth'

export function AuthFormField({
  id,
  label,
  type = 'text',
  autoComplete,
  value,
  onChange,
  error,
  disabled,
}: AuthFormFieldProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-foreground">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        autoComplete={autoComplete}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(
          'w-full rounded-lg border px-3 py-2.5 text-sm text-foreground bg-background',
          'outline-none transition-colors placeholder:text-muted-foreground',
          'focus:border-primary focus:ring-2 focus:ring-primary/20',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          error ? 'border-destructive' : 'border-border',
        )}
      />
      {error && (
        <p id={`${id}-error`} className="text-xs text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
