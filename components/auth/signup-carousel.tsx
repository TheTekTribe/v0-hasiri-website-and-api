"use client"

import { useState, useEffect } from "react"
import { VideoTestimonial } from "@/components/video-testimonial"
import { AnimatedLogo } from "@/components/animated-logo"
import { Loader2 } from "lucide-react"

interface Testimonial {
  id: string
  image_url: string
  quote: string
  author: string
  video_id: string
  profile_image: string
}

export function SignupCarousel() {
  const [slides, setSlides] = useState<Testimonial[]>([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch("/api/testimonials?page=signup")
        const data = await response.json()

        if (data.success && data.data.length > 0) {
          setSlides(data.data)
        } else {
          // Fallback to default testimonials if none found
          setSlides([
            {
              id: "1",
              image_url: "/tech-harvest.png",
              quote:
                "Join thousands of farmers who have improved their yields and sustainability with Hasiri's innovative agricultural solutions.",
              author: "Priya Sharma, Agricultural Consultant",
              video_id: "dQw4w9WgXcQ",
              profile_image: "/farmer-profile-1.png",
            },
            {
              id: "2",
              image_url: "/rolling-green-fields.png",
              quote:
                "Since implementing Hasiri's soil health program, my wheat yields have increased by 30% while using less water and chemical inputs.",
              author: "Rajesh Kumar, Punjab Farmer",
              video_id: "jNQXAC9IVRw",
              profile_image: "/farmer-profile-2.png",
            },
            {
              id: "3",
              image_url: "/collaborative-harvest.png",
              quote:
                "The Hasiri community has been invaluable. I've learned sustainable practices from other farmers that have transformed my farm's productivity.",
              author: "Amina Patel, Organic Farmer",
              video_id: "jNQXAC9IVRw",
              profile_image: "/farmer-profile-3.png",
            },
          ])
        }
      } catch (error) {
        console.error("Error fetching testimonials:", error)
        // Use fallback testimonials
        setSlides([
          {
            id: "1",
            image_url: "/tech-harvest.png",
            quote:
              "Join thousands of farmers who have improved their yields and sustainability with Hasiri's innovative agricultural solutions.",
            author: "Priya Sharma, Agricultural Consultant",
            video_id: "dQw4w9WgXcQ",
            profile_image: "/farmer-profile-1.png",
          },
          {
            id: "2",
            image_url: "/rolling-green-fields.png",
            quote:
              "Since implementing Hasiri's soil health program, my wheat yields have increased by 30% while using less water and chemical inputs.",
            author: "Rajesh Kumar, Punjab Farmer",
            video_id: "jNQXAC9IVRw",
            profile_image: "/farmer-profile-2.png",
          },
          {
            id: "3",
            image_url: "/collaborative-harvest.png",
            quote:
              "The Hasiri community has been invaluable. I've learned sustainable practices from other farmers that have transformed my farm's productivity.",
            author: "Amina Patel, Organic Farmer",
            video_id: "jNQXAC9IVRw",
            profile_image: "/farmer-profile-3.png",
          },
        ])
      } finally {
        setIsLoading(false)
      }
    }

    fetchTestimonials()
  }, [])

  useEffect(() => {
    if (slides.length === 0) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 8000)
    return () => clearInterval(interval)
  }, [slides.length])

  if (isLoading) {
    return (
      <div className="relative h-full w-full overflow-hidden bg-zinc-900 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    )
  }

  if (slides.length === 0) {
    return (
      <div className="relative h-full w-full overflow-hidden bg-zinc-900 flex items-center justify-center">
        <p className="text-white text-center">No testimonials available</p>
      </div>
    )
  }

  return (
    <div className="relative h-full w-full overflow-hidden bg-zinc-900">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="absolute inset-0 overflow-hidden">
            <img
              src={slide.image_url || "/placeholder.svg"}
              alt={`Slide ${index + 1}`}
              className="object-cover w-full h-full opacity-50"
            />
          </div>
          <div className="relative z-20 flex flex-col h-full p-10">
            <div className="flex justify-center mb-8">
              <AnimatedLogo className="h-24 w-auto" />
            </div>

            <div className="flex justify-center mb-4">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`w-2 h-2 rounded-full mx-1 transition-colors ${
                    idx === currentSlide ? "bg-white" : "bg-white/50"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            <div className="mt-auto">
              <VideoTestimonial
                quote={slide.quote}
                author={slide.author}
                videoId={slide.video_id}
                profileImage={slide.profile_image}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
