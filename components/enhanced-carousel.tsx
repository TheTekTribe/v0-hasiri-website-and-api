"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import type { CarouselImage } from "@/lib/services/homepage-service"

interface EnhancedCarouselProps {
  images?: CarouselImage[]
}

export function EnhancedCarousel({ images = [] }: EnhancedCarouselProps) {
  const plugin = React.useRef(Autoplay({ delay: 5000, stopOnInteraction: true }))

  // Use default images if none are provided
  const carouselImages =
    images.length > 0
      ? images
      : [
          {
            id: "1",
            image_url: "/placeholder.svg?height=600&width=1200&text=Healthy+Soil",
            title: "Healthy Soil, Healthy Crops",
            subtitle: "Hasiri's soil health program increased my crop yield by 40% in just one season!",
            cta_text: "Discover Our Soil Solutions",
            cta_link: "/products/soil-health",
            display_order: 0,
            is_enabled: true,
            created_at: "",
            updated_at: "",
          },
          {
            id: "2",
            image_url: "/placeholder.svg?height=600&width=1200&text=Organic+Farming",
            title: "Organic Farming Success",
            subtitle: "Switching to organic farming with Hasiri's guidance has transformed my business.",
            cta_text: "Explore Organic Products",
            cta_link: "/products/organic",
            display_order: 1,
            is_enabled: true,
            created_at: "",
            updated_at: "",
          },
        ]

  return (
    <Carousel
      plugins={[plugin.current]}
      className="w-full"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent>
        {carouselImages.map((slide) => (
          <CarouselItem key={slide.id}>
            <div className="relative h-[300px] sm:h-[400px] md:h-[500px] w-full overflow-hidden rounded-xl">
              <Image
                src={slide.image_url || "/placeholder.svg"}
                alt={slide.title || "Carousel slide"}
                fill
                className="object-cover"
                priority={slide.display_order === 0}
              />
              <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-6 md:p-10">
                <div className="max-w-md bg-black/50 backdrop-blur-sm p-4 md:p-6 rounded-lg">
                  <div className="flex items-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <blockquote className="text-white text-lg md:text-xl mb-2 italic">
                    "{slide.subtitle || ""}"
                  </blockquote>
                  <div className="text-white font-semibold">{slide.title || ""}</div>
                  {slide.cta_link && slide.cta_text && (
                    <Link href={slide.cta_link} className="mt-4 inline-block">
                      <Button className="bg-[#2E7D32] hover:bg-[#1B5E20]">{slide.cta_text}</Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="absolute bottom-4 right-4 flex gap-2 z-10">
        <CarouselPrevious className="h-8 w-8 rounded-full" />
        <CarouselNext className="h-8 w-8 rounded-full" />
      </div>
    </Carousel>
  )
}
