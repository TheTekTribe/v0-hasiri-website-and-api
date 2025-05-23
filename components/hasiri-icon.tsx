import Link from "next/link"
import { cn } from "@/lib/utils"

interface HasiriIconProps {
  className?: string
  linkClassName?: string
  href?: string
  showLink?: boolean
  showLeafAccent?: boolean
  borderRadius?: "none" | "sm" | "md" | "lg" | "full"
}

export function HasiriIcon({
  className = "h-8 w-8",
  linkClassName,
  href = "/",
  showLink = true,
  showLeafAccent = true,
  borderRadius = "full",
}: HasiriIconProps) {
  const iconContent = (
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
        style={{ fontSize: "calc(var(--size, 1em) * 0.7)" }}
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

  if (showLink) {
    return (
      <Link href={href} className={cn("inline-flex", linkClassName)}>
        {iconContent}
      </Link>
    )
  }

  return iconContent
}
