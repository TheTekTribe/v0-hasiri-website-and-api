import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function Testimonials() {
  const testimonials = [
    {
      name: "Rajesh Kumar",
      location: "Punjab",
      quote:
        "Since implementing Hasiri's soil health program, my wheat yields have increased by 30% while using less water and chemical inputs.",
      avatar: "RK",
    },
    {
      name: "Anita Patel",
      location: "Gujarat",
      quote:
        "The knowledge I've gained from Hasiri has transformed my farm. My soil is healthier, and my crops are more resilient to drought.",
      avatar: "AP",
    },
    {
      name: "Suresh Reddy",
      location: "Andhra Pradesh",
      quote:
        "Hasiri's products and guidance helped me transition to organic farming. Now I earn premium prices for my crops in the market.",
      avatar: "SR",
    },
  ]

  return (
    <section className="py-12 md:py-24 bg-[#F8F5F0]">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Farmer Success Stories</h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Hear from farmers who have transformed their land with Hasiri
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-12 py-12">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="text-center">
              <CardHeader>
                <div className="flex justify-center">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={`/placeholder.svg?height=64&width=64&text=${testimonial.avatar}`} />
                    <AvatarFallback>{testimonial.avatar}</AvatarFallback>
                  </Avatar>
                </div>
                <CardTitle className="mt-4">{testimonial.name}</CardTitle>
                <p className="text-sm text-gray-500">{testimonial.location}</p>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500 italic">"{testimonial.quote}"</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
