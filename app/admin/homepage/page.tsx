import { HomepageBuilder } from "@/components/admin/homepage-builder"
import { getHomepageSections, getCarouselImages } from "@/lib/services/homepage-service"

export default async function HomepagePage() {
  // Fetch homepage sections and carousel images
  const [sections, carouselImages] = await Promise.all([getHomepageSections(), getCarouselImages()])

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold tracking-tight">Homepage Builder</h1>
      <p className="text-muted-foreground">
        Customize your homepage by reordering sections, enabling/disabling them, or editing their content.
      </p>
      <HomepageBuilder initialSections={sections} initialCarouselImages={carouselImages} />
    </div>
  )
}
