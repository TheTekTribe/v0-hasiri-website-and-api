import { TestimonialManager } from "@/components/admin/testimonial-manager"

export default function TestimonialsPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Testimonial Management</h1>
        <p className="text-muted-foreground">Manage testimonials and carousel slides for login and signup pages.</p>
      </div>

      <TestimonialManager />
    </div>
  )
}
