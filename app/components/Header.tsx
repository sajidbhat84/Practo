"use client"

import Link from "next/link"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="bg-blue-600 text-white px-3 py-1 rounded-md font-bold text-lg">practo</div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/doctors" className="text-blue-600 font-medium border-b-2 border-blue-600 pb-1">
              Find Doctors
            </Link>
            <Link href="/video-consult" className="text-gray-700 hover:text-blue-600">
              Video Consult
            </Link>
            <Link href="/surgeries" className="text-gray-700 hover:text-blue-600">
              Surgeries
            </Link>
          </nav>

          {/* Right side menu */}
          <div className="flex items-center space-x-4">
            <div className="hidden lg:flex items-center space-x-4">
              <div className="flex items-center text-gray-700 hover:text-blue-600 cursor-pointer">
                <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded mr-2">NEW</span>
                <span>For Corporates</span>
                <ChevronDown className="h-4 w-4 ml-1" />
              </div>
              <div className="flex items-center text-gray-700 hover:text-blue-600 cursor-pointer">
                <span>For Providers</span>
                <ChevronDown className="h-4 w-4 ml-1" />
              </div>
              <div className="flex items-center text-gray-700 hover:text-blue-600 cursor-pointer">
                <span>Security & help</span>
                <ChevronDown className="h-4 w-4 ml-1" />
              </div>
            </div>
            <Button variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-50 bg-transparent">
              Login / Signup
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
