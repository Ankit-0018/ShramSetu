import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap w-fit shrink-0",
  {
    variants: {
      variant: {
        default: "bg-secondary text-secondary-foreground",
        success: "bg-success-muted text-success-muted-foreground",
        warning: "bg-warning-muted text-warning-muted-foreground",
        danger: "bg-danger-muted text-danger-muted-foreground",
        primary: "bg-primary text-primary-foreground",
        outline: "border border-input text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant, className }))}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
