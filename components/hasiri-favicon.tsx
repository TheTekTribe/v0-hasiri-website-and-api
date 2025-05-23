import { cn } from "@/lib/utils"

interface HasiriFaviconProps {
  className?: string
  showLeafAccent?: boolean
  borderRadius?: "none" | "sm" | "md" | "lg" | "full"
}

export function HasiriFavicon({
  className = "h-4 w-4",
  showLeafAccent = true,
  borderRadius = "full",
}: HasiriFaviconProps) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center",
        borderRadius === "none" && "rounded-none",
        borderRadius === "sm" && "rounded-sm",
        borderRadius === "md" && "rounded-md",
        borderRadius === "lg" && "rounded-lg",
        borderRadius === "full" && "rounded-full",
        "bg-[var(--icon-bg,#4CAF50)]",
        className,
      )}
    >
      <span
        className="text-[var(--icon-color,#ffffff)] font-bold text-center"
        style={{ fontSize: "calc(var(--size, 1em) * 0.5)" }} // Smaller size for favicon
      >
        H
      </span>

      {showLeafAccent && (
        <svg
          className="absolute bottom-0 w-full"
          height="30%"
          viewBox="0 0 100 30"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMax meet"
        >
          <path
            d="M20,25 C20,25 40,15 50,15 C60,15 80,25 80,25"
            fill="none"
            stroke="var(--icon-color, #ffffff)"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>
      )}
    </div>
  )
}
