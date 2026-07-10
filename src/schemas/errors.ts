import { z } from 'zod'

const MAX_ISSUES = 5

export function formatZodError(error: z.ZodError): string {
  const issues = error.issues.slice(0, MAX_ISSUES)
  const msg = issues
    .map(issue => {
      const path = issue.path.length > 0 ? `${issue.path.join('.')}: ` : ''
      return `${path}${issue.message}`
    })
    .join('; ')
  const remaining = error.issues.length - issues.length
  return remaining > 0 ? `${msg} (+${remaining} további hiba)` : msg
}
