import type { UseRenderRenderProp } from "@base-ui/react/use-render"
import type { Button as ButtonType } from "@base-ui/react/button"
import type { Collapsible as CollapsiblePrimitive } from "@base-ui/react/collapsible"

export type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'link'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  render?: UseRenderRenderProp<{ slot: string; variant: string }>
}

export type ButtonVariant = 'default' | 'outline' | 'secondary' | 'ghost' | 'destructive' | 'link'
export type ButtonSize = 'default' | 'xs' | 'sm' | 'lg' | 'icon' | 'icon-xs' | 'icon-sm' | 'icon-lg'

export interface ButtonProps extends ButtonType.Props {
  className?: string
  variant?: ButtonVariant
  size?: ButtonSize
}

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'default' | 'sm'
}

export type CardSubProps = React.HTMLAttributes<HTMLDivElement>

export type CollapsibleProps = CollapsiblePrimitive.Root.Props
export type CollapsibleTriggerProps = CollapsiblePrimitive.Trigger.Props
export type CollapsibleContentProps = CollapsiblePrimitive.Panel.Props

export interface PageProps {
  constrained?: boolean
  flushTop?: boolean
  className?: string
  children: React.ReactNode
}

export interface PageHeaderProps {
  title: string
  subtitle?: string
  leading?: React.ReactNode
  trailing?: React.ReactNode
  className?: string
}

export interface SectionProps {
  title: string
  eyebrow?: string
  action?: React.ReactNode
  className?: string
  children: React.ReactNode
}

export interface RowProps {
  icon?: React.ReactNode
  title: string
  subtitle?: string
  trailing?: React.ReactNode
  onClick?: () => void
  href?: string
  className?: string
}

export interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

export interface LoadingStateProps {
  label?: string
  className?: string
}

export interface InlineErrorProps {
  message: string
  onRetry?: () => void
  className?: string
}

export interface TimelineItemProps {
  time: string
  title: string
  description?: string
  badges?: string[]
  highlight?: boolean
  actions?: React.ReactNode
  className?: string
}

export interface TimelineProps {
  children: React.ReactNode
  className?: string
}
