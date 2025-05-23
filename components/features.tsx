import { Leaf, Droplets, Sun, Sprout } from "lucide-react"

export function Features() {
  const features = [
    {
      icon: <Leaf className="h-10 w-10 text-[#2E7D32]" />,
      title: "Organic Solutions",
      description:
        "Our products are 100% organic, ensuring sustainable farming practices that protect the environment.",
    },
    {
      icon: <Droplets className="h-10 w-10 text-[#2E7D32]" />,
      title: "Water Efficiency",
      description: "Improve water retention in soil, reducing irrigation needs and conserving this precious resource.",
    },
    {
      icon: <Sun className="h-10 w-10 text-[#2E7D32]" />,
      title: "Climate Resilience",
      description:
        "Build resilient farming systems that can withstand changing climate conditions and extreme weather.",
    },
    {
      icon: <Sprout className="h-10 w-10 text-[#2E7D32]" />,
      title: "Increased Yields",
      description: "Healthier soil leads to stronger plants, higher yields, and improved crop quality.",
    },
  ]

  return (
    <section className="py-12 md:py-24 bg-white">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Why Choose Hasiri</h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Our regenerative agriculture approach focuses on soil health as the foundation for sustainable farming
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:gap-12">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
              {feature.icon}
              <h3 className="text-xl font-bold">{feature.title}</h3>
              <p className="text-center text-gray-500 dark:text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
