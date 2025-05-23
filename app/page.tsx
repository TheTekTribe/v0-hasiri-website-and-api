import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { Products } from "@/components/products"
import { Testimonials } from "@/components/testimonials"
import { Education } from "@/components/education"
import { CTA } from "@/components/cta"
import { EnhancedCarousel } from "@/components/enhanced-carousel"
import { getEnabledHomepageSections, getEnabledCarouselImages } from "@/lib/services/homepage-service"

export default async function Home() {
  // Fetch enabled homepage sections and carousel images
  const [sections, carouselImages] = await Promise.all([
    getEnabledHomepageSections().catch(() => []),
    getEnabledCarouselImages().catch(() => []),
  ])

  // Sort sections by display_order
  const sortedSections = [...sections].sort((a, b) => a.display_order - b.display_order)

  // Create a map of section components
  const sectionComponents = {
    hero: <Hero />,
    features: <Features />,
    products: <Products />,
    testimonials: <Testimonials />,
    education: <Education />,
    cta: <CTA />,
    carousel: <EnhancedCarousel images={carouselImages} />,
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {sortedSections.length > 0 ? (
          sortedSections.map((section) => {
            const SectionComponent = sectionComponents[section.section_type as keyof typeof sectionComponents]
            return SectionComponent ? <div key={section.id}>{SectionComponent}</div> : null
          })
        ) : (
          // Fallback to default layout if no sections are found
          <>
            <Hero />
            <Features />
            <Products />
            <Education />
            <Testimonials />
            <CTA />
          </>
        )}
      </main>
      <Footer />
    </div>
  )
}
