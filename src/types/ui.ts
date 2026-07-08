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
