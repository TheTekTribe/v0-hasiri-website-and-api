import Link from "next/link"
import { Button } from "@/components/ui/button"
import { HeroCarousel } from "@/components/hero-carousel"

export function Hero() {
  return (
    <section className="py-8 sm:py-12 md:py-16 lg:py-24 overflow-hidden bg-[#F8F5F0]">
      <div className="container px-4 sm:px-6">
        <div className="flex flex-col gap-8 md:flex-row md:gap-10 lg:gap-12">
          {/* Text content - stacked on mobile, side by side on larger screens */}
          <div className="flex flex-col space-y-4 md:w-1/2 md:justify-center">
            <div className="space-y-2 text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tighter">
                Revitalize Your Soil, Regenerate Your Farm
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-gray-500 dark:text-gray-400 max-w-[600px] mx-auto sm:mx-0">
                Hasiri empowers farmers with sustainable solutions for healthier soil, higher yields, and a greener
                future.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center sm:justify-start">
              <Link href="/products" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto bg-[#2E7D32] hover:bg-[#1B5E20] rounded-full">
                  Shop Products
                </Button>
              </Link>
              <Link href="/learn" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-full">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>

          {/* Carousel - full width on mobile, half width on larger screens */}
          <div className="w-full md:w-1/2">
            <HeroCarousel />
          </div>
        </div>
      </div>
    </section>
  )
}
