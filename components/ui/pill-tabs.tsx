import { cn } from "@/lib/utils"

export type PillTabItem = {
  key: string
  label: string
  count?: number
}

function PillTabs({
  items,
  active,
  onChange,
  className,
}: {
  items: PillTabItem[]
  active: string
  onChange: (key: string) => void
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex gap-2 overflow-x-auto rounded-full bg-secondary p-1",
        className
      )}
    >
      {items.map((item) => {
        const isActive = item.key === active
        return (
          <button
            key={item.key}
            type="button"
            onClick={() => onChange(item.key)}
            className={cn(
              "flex-1 whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {item.label}
            {typeof item.count === "number" ? ` · ${item.count}` : ""}
          </button>
        )
      })}
    </div>
  )
}

export { PillTabs }
