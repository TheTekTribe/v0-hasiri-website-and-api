import Link from "next/link"
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-[#1B5E20] text-white">
      <div className="container px-4 py-12 md:px-6 md:py-16">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Hasiri</h3>
            <p className="text-sm text-gray-200">
              Empowering farmers with regenerative agriculture solutions for healthier soil and sustainable farming.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="hover:text-gray-200">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="hover:text-gray-200">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="hover:text-gray-200">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="hover:text-gray-200">
                <Youtube className="h-5 w-5" />
                <span className="sr-only">YouTube</span>
              </Link>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/products" className="hover:underline">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/learn" className="hover:underline">
                  Learn
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:underline">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:underline">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:underline">
                  Blog
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Products</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/products/bio-stimulants" className="hover:underline">
                  Bio-Stimulants
                </Link>
              </li>
              <li>
                <Link href="/products/organic-fertilizers" className="hover:underline">
                  Organic Fertilizers
                </Link>
              </li>
              <li>
                <Link href="/products/seeds" className="hover:underline">
                  Seeds
                </Link>
              </li>
              <li>
                <Link href="/products/soil-amendments" className="hover:underline">
                  Soil Amendments
                </Link>
              </li>
              <li>
                <Link href="/products/tools" className="hover:underline">
                  Tools & Equipment
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start space-x-2">
                <MapPin className="h-5 w-5 shrink-0" />
                <span>123 Farming Road, Bangalore, Karnataka, India</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-5 w-5 shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-5 w-5 shrink-0" />
                <span>info@hasiri.com</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-600 pt-8 text-center text-sm">
          <p>© {new Date().getFullYear()} Hasiri. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
