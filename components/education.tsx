import Link from "next/link"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function Education() {
  const resources = [
    {
      title: "Soil Health Basics",
      description: "Learn the fundamentals of soil health and why it matters for your farm",
      image: "/placeholder.svg?height=200&width=300",
      link: "/learn/soil-health-basics",
    },
    {
      title: "Regenerative Practices",
      description: "Discover techniques to implement regenerative agriculture on your land",
      image: "/placeholder.svg?height=200&width=300",
      link: "/learn/regenerative-practices",
    },
    {
      title: "Crop Rotation Guide",
      description: "Maximize soil benefits with strategic crop rotation planning",
      image: "/placeholder.svg?height=200&width=300",
      link: "/learn/crop-rotation",
    },
  ]

  return (
    <section className="py-12 md:py-24 bg-white">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Educational Resources</h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Empowering farmers with knowledge and skills for sustainable agriculture
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8 py-12">
          {resources.map((resource, index) => (
            <Card key={index} className="overflow-hidden">
              <img
                src={resource.image || "/placeholder.svg"}
                alt={resource.title}
                className="w-full h-48 object-cover"
              />
              <CardHeader>
                <CardTitle>{resource.title}</CardTitle>
                <CardDescription>{resource.description}</CardDescription>
              </CardHeader>
              <CardFooter>
                <Link href={resource.link} className="w-full">
                  <Button variant="outline" className="w-full">
                    Read More
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
        <div className="flex justify-center">
          <Link href="/learn">
            <Button variant="outline" size="lg">
              Explore All Resources
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
