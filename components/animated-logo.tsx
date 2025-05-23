"use client"

import { useEffect, useRef } from "react"

interface AnimatedLogoProps {
  className?: string
}

export function AnimatedLogo({ className = "h-16 w-auto" }: AnimatedLogoProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current) return

    const paths = svgRef.current.querySelectorAll("path")

    // Reset all paths
    paths.forEach((path) => {
      if (path.classList.contains("leaf")) return
      path.style.strokeDasharray = `${path.getTotalLength()}`
      path.style.strokeDashoffset = `${path.getTotalLength()}`
      path.style.fill = "transparent"
    })

    // Animate paths
    paths.forEach((path, index) => {
      if (path.classList.contains("leaf")) return

      setTimeout(() => {
        // Draw stroke
        path.style.transition = "stroke-dashoffset 1s ease-in-out"
        path.style.strokeDashoffset = "0"

        // Fill after stroke is drawn
        setTimeout(() => {
          path.style.transition = "fill 0.5s ease-in-out"
          path.style.fill = "#4CAF50"
        }, 800)
      }, index * 150)
    })

    // Animate leaf last
    const leaf = svgRef.current.querySelector(".leaf")
    if (leaf instanceof SVGPathElement) {
      setTimeout(() => {
        leaf.style.strokeDasharray = `${leaf.getTotalLength()}`
        leaf.style.strokeDashoffset = `${leaf.getTotalLength()}`
        leaf.style.transition = "stroke-dashoffset 1s ease-in-out"
        leaf.style.strokeDashoffset = "0"
      }, paths.length * 150)
    }
  }, [])

  return (
    <div className={className}>
      <svg ref={svgRef} className="h-full w-auto" viewBox="0 0 240 60" xmlns="http://www.w3.org/2000/svg">
        {/* H */}
        <path d="M20,10 H30 V25 H50 V10 H60 V50 H50 V35 H30 V50 H20 V10 Z" stroke="#ffffff" strokeWidth="2" />
        {/* A */}
        <path
          d="M70,50 L85,10 H95 L110,50 H100 L96,40 H84 L80,50 H70 Z M86,32 H94 L90,20 L86,32 Z"
          stroke="#ffffff"
          strokeWidth="2"
        />
        {/* S */}
        <path
          d="M120,15 C120,15 130,10 140,10 C150,10 155,15 155,20 C155,25 150,28 140,30 C130,32 125,35 125,40 C125,45 130,50 140,50 C150,50 160,45 160,45 L155,37 C155,37 147,42 140,42 C133,42 130,39 130,37 C130,33 135,31 145,29 C155,27 160,23 160,17 C160,11 155,5 140,5 C125,5 115,12 115,12 L120,15 Z"
          stroke="#ffffff"
          strokeWidth="2"
        />
        {/* I */}
        <path d="M170,10 H180 V50 H170 V10 Z" stroke="#ffffff" strokeWidth="2" />
        {/* R - Fixed to ensure it looks like R not P */}
        <path
          d="M190,10 H210 C220,10 225,15 225,22 C225,29 220,33 210,33 H200 V50 H190 V10 Z M200,25 H208 C212,25 215,23 215,20 C215,17 212,15 208,15 H200 V25 Z M210,33 L225,50 H215 L200,33 Z"
          stroke="#ffffff"
          strokeWidth="2"
        />
        {/* I */}
        <path d="M230,10 H240 V50 H230 V10 Z" stroke="#ffffff" strokeWidth="2" />
        {/* Leaf accent */}
        <path
          className="leaf"
          d="M120,55 C120,55 140,45 170,45 C200,45 220,55 220,55"
          fill="none"
          stroke="#ffffff"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  )
}
