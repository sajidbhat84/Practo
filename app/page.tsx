"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, MapPin, MessageSquare, ShoppingCart, FileText, Calendar, BookOpen, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Header from "./components/Header"

export default function HomePage() {
  const [location, setLocation] = useState("Bangalore")
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/doctors?location=${encodeURIComponent(location)}&specialty=${encodeURIComponent(searchQuery)}`)
    }
  }

  const popularSearches = ["Dermatologist", "Pediatrician", "Gynecologist/Obstetrician", "Orthopedist"]

  const services = [
    { icon: MessageSquare, title: "Consult with a doctor", description: "Get expert medical advice" },
    { icon: ShoppingCart, title: "Order Medicines", description: "Get medicines delivered" },
    { icon: FileText, title: "View medical records", description: "Access your health records" },
    { icon: Calendar, title: "Book test", description: "Schedule lab tests", badge: "New" },
    { icon: BookOpen, title: "Read articles", description: "Health tips and articles" },
    { icon: Users, title: "For healthcare providers", description: "Join our network" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900">
      <Header />

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-32 h-32 bg-yellow-400 rounded-full"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-orange-400 rounded-full"></div>
          <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-green-400 rounded-full"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-16 md:py-24">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-8">Your home for health</h1>

            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-semibold text-white mb-8">Find and Book</h2>

              {/* Search Section */}
              <div className="bg-white rounded-lg p-2 flex flex-col md:flex-row gap-2 shadow-xl">
                <div className="flex items-center px-4 py-3 border-r border-gray-200 min-w-0 md:w-1/3">
                  <MapPin className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
                  <Input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="border-0 p-0 text-gray-700 focus-visible:ring-0"
                    placeholder="Location"
                  />
                </div>
                <div className="flex items-center px-4 py-3 flex-1">
                  <Search className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                    className="border-0 p-0 text-gray-700 focus-visible:ring-0"
                    placeholder="Search doctors, clinics, hospitals, etc."
                  />
                </div>
                <Button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-md">
                  Search
                </Button>
              </div>

              {/* Popular Searches */}
              <div className="mt-6 text-left">
                <span className="text-white/80 text-sm mr-4">Popular searches:</span>
                <div className="inline-flex flex-wrap gap-2 mt-2">
                  {popularSearches.map((search) => (
                    <button
                      key={search}
                      onClick={() => {
                        setSearchQuery(search)
                        handleSearch()
                      }}
                      className="bg-blue-700/50 hover:bg-blue-600/50 text-white px-4 py-2 rounded-full text-sm transition-colors"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            {services.map((service, index) => (
              <div key={index} className="text-center p-6 hover:shadow-lg transition-shadow rounded-lg">
                <div className="relative inline-block mb-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                    <service.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  {service.badge && (
                    <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                      {service.badge}
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">{service.title}</h3>
                <p className="text-sm text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
