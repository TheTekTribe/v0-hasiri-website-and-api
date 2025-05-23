"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"

interface SlideContent {
  problem: string
  solution: string
  data: string
  dataLabel: string
  ctaText: string
  ctaLink: string
  bgColor: string
  textColor: string
}

const slides: SlideContent[] = [
  {
    problem: "Soil degradation reduces crop yields",
    solution: "Our regenerative solutions restore soil health",
    data: "40%",
    dataLabel: "average yield increase",
    ctaText: "Explore Soil Solutions",
    ctaLink: "/products/soil-health",
    bgColor: "bg-[#E8F5E9]",
    textColor: "text-[#1B5E20]",
  },
  {
    problem: "Chemical fertilizers harm long-term soil health",
    solution: "Organic inputs build sustainable fertility",
    data: "65%",
    dataLabel: "reduction in chemical usage",
    ctaText: "Shop Organic Inputs",
    ctaLink: "/products/organic",
    bgColor: "bg-[#FFF8E1]",
    textColor: "text-[#F57F17]",
  },
  {
    problem: "Water scarcity threatens crop production",
    solution: "Improved soil structure increases water retention",
    data: "30%",
    dataLabel: "less irrigation needed",
    ctaText: "Water-Saving Solutions",
    ctaLink: "/products/water-management",
    bgColor: "bg-[#E3F2FD]",
    textColor: "text-[#0D47A1]",
  },
  {
    problem: "Pest damage reduces harvest quality",
    solution: "Natural pest management preserves ecosystem balance",
    data: "80%",
    dataLabel: "of farmers report fewer pest issues",
    ctaText: "Natural Pest Control",
    ctaLink: "/products/pest-control",
    bgColor: "bg-[#F3E5F5]",
    textColor: "text-[#6A1B9A]",
  },
]

export function HeroCarousel() {
  const plugin = React.useRef(Autoplay({ delay: 5000, stopOnInteraction: true }))

  return (
    <Carousel
      plugins={[plugin.current]}
      className="w-full"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent>
        {slides.map((slide, index) => (
          <CarouselItem key={index}>
            <div className={`${slide.bgColor} rounded-lg p-4 sm:p-6 md:p-8 h-full`}>
              <div className="flex flex-col gap-3 sm:gap-4 md:gap-6">
                <div className="space-y-1 sm:space-y-2">
                  <h3 className="text-base sm:text-lg font-medium text-gray-600">Problem:</h3>
                  <p className="text-lg sm:text-xl md:text-2xl font-bold">{slide.problem}</p>
                </div>

                <div className="space-y-1 sm:space-y-2">
                  <h3 className="text-base sm:text-lg font-medium text-gray-600">Solution:</h3>
                  <p className="text-lg sm:text-xl md:text-2xl font-bold">{slide.solution}</p>
                </div>

                <div className="flex flex-row items-baseline gap-2 sm:gap-3 md:gap-4">
                  <span className={`text-3xl sm:text-4xl md:text-5xl font-bold ${slide.textColor}`}>{slide.data}</span>
                  <span className="text-base sm:text-lg md:text-xl text-gray-700">{slide.dataLabel}</span>
                </div>

                <div className="pt-2 sm:pt-3 md:pt-4">
                  <Link href={slide.ctaLink}>
                    <Button size="sm" className="bg-[#2E7D32] hover:bg-[#1B5E20] sm:text-base sm:py-2">
                      {slide.ctaText}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="flex justify-center gap-2 mt-3 sm:mt-4">
        <CarouselPrevious className="relative inset-auto translate-y-0 h-8 w-8 sm:h-9 sm:w-9" />
        <CarouselNext className="relative inset-auto translate-y-0 h-8 w-8 sm:h-9 sm:w-9" />
      </div>
    </Carousel>
  )
}
