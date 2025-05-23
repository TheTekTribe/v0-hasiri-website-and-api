"use client"

import { useState } from "react"
import { Play } from "lucide-react"

interface VideoTestimonialProps {
  quote: string
  author: string
  videoId: string
  profileImage?: string
}

export function VideoTestimonial({ quote, author, videoId, profileImage }: VideoTestimonialProps) {
  const [showVideo, setShowVideo] = useState(false)

  const handleClick = () => {
    setShowVideo(true)
  }

  return (
    <blockquote className="relative space-y-4 bg-black/30 p-6 rounded-lg backdrop-blur-sm border border-white/10">
      <div className="flex items-center gap-4 mb-4">
        {profileImage && (
          <div className="flex-shrink-0">
            <img
              src={profileImage || "/placeholder.svg"}
              alt={author}
              className="h-16 w-16 rounded-full border-2 border-white/30 object-cover"
            />
          </div>
        )}
        <div>
          <p className="text-lg text-white">{quote}</p>
          <footer className="mt-2 text-sm text-white/80">{author}</footer>
        </div>
      </div>

      {showVideo ? (
        <div className="w-[70%] mx-auto">
          <div className="aspect-video">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      ) : (
        <div
          className="relative aspect-video w-[70%] mx-auto bg-black/40 rounded-md overflow-hidden group cursor-pointer"
          onClick={handleClick}
        >
          <img
            src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
            alt="Video thumbnail"
            className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity"
            onError={(e) => {
              // Fallback to hqdefault if maxresdefault is not available
              ;(e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full">
              <Play className="h-8 w-8 text-white" />
            </div>
          </div>
          <div className="absolute bottom-2 left-2 right-2 text-white text-xs bg-black/50 p-1 rounded">
            Click to play video testimonial
          </div>
        </div>
      )}
    </blockquote>
  )
}
