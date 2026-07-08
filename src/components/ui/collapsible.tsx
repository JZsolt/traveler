import { Collapsible as CollapsiblePrimitive } from "@base-ui/react/collapsible"
import type { CollapsibleProps, CollapsibleTriggerProps, CollapsibleContentProps } from "@/types/ui"

function Collapsible(props: CollapsibleProps) {
  return <CollapsiblePrimitive.Root data-slot="collapsible" {...props} />
}

function CollapsibleTrigger(props: CollapsibleTriggerProps) {
  return <CollapsiblePrimitive.Trigger data-slot="collapsible-trigger" {...props} />
}

function CollapsibleContent(props: CollapsibleContentProps) {
  return <CollapsiblePrimitive.Panel data-slot="collapsible-content" {...props} />
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
