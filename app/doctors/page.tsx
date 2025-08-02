"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { MapPin, Search, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Header from "../components/Header"
import DoctorCard from "../components/DoctorCard"

interface Doctor {
  id: string
  name: string
  specialty: string
  experience: number
  location: string
  clinicName: string
  consultationFee: number
  rating: number
  patientStories: number
  image?: string
  availableToday: boolean
  clinicLogo?: string
}

// Fallback data in case API fails
const fallbackDoctors: Doctor[] = [
  {
    id: "1",
    name: "Dr. Aesthetic Heart",
    specialty: "Dermatologist",
    experience: 12,
    location: "Jayanagar, Bangalore",
    clinicName: "Aesthetic Heart Dermatology & Cardiology Clinic",
    consultationFee: 800,
    rating: 97,
    patientStories: 159,
    availableToday: false,
    clinicLogo: "/placeholder.svg?height=60&width=60&text=AH",
  },
  {
    id: "2",
    name: "Dr. Sheelavathi Natraj",
    specialty: "Dermatologist",
    experience: 21,
    location: "JP Nagar, Bangalore",
    clinicName: "Sapphire Skin And Aesthetics Clinic",
    consultationFee: 800,
    rating: 94,
    patientStories: 1506,
    image: "/placeholder.svg?height=80&width=80&text=SN",
    availableToday: true,
  },
  {
    id: "3",
    name: "Dr. Rajesh Kumar",
    specialty: "Dermatologist",
    experience: 15,
    location: "JP Nagar, Bangalore",
    clinicName: "Skin Care Clinic",
    consultationFee: 600,
    rating: 92,
    patientStories: 890,
    availableToday: true,
  },
  {
    id: "4",
    name: "Dr. Priya Sharma",
    specialty: "Pediatrician",
    experience: 8,
    location: "Jayanagar, Bangalore",
    clinicName: "Child Care Center",
    consultationFee: 500,
    rating: 96,
    patientStories: 445,
    availableToday: false,
  },
  {
    id: "5",
    name: "Dr. Meera Joshi",
    specialty: "Pediatrician",
    experience: 12,
    location: "Whitefield, Bangalore",
    clinicName: "Little Angels Clinic",
    consultationFee: 600,
    rating: 95,
    patientStories: 623,
    availableToday: true,
  },
]

export default function DoctorsPage() {
  const searchParams = useSearchParams()
  const [location, setLocation] = useState("JP Nagar")
  const [specialty, setSpecialty] = useState("Dermatologist")
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState({
    gender: "all",
    experience: "all",
    sortBy: "relevance",
  })

  // Filter doctors locally
  const filterDoctors = (doctorList: Doctor[]) => {
    let filtered = [...doctorList]

    // Filter by specialty
    if (specialty && specialty.trim()) {
      const searchTerm = specialty.toLowerCase().trim()
      filtered = filtered.filter(
        (doctor) =>
          doctor.specialty.toLowerCase().includes(searchTerm) ||
          doctor.name.toLowerCase().includes(searchTerm) ||
          doctor.clinicName.toLowerCase().includes(searchTerm),
      )
    }

    // Filter by location
    if (location && location.trim()) {
      const searchTerm = location.toLowerCase().trim()
      filtered = filtered.filter(
        (doctor) =>
          doctor.location.toLowerCase().includes(searchTerm) || doctor.location.toLowerCase().includes("bangalore"),
      )
    }

    // Sort results
    switch (filters.sortBy) {
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case "experience":
        filtered.sort((a, b) => b.experience - a.experience)
        break
      case "fee":
        filtered.sort((a, b) => a.consultationFee - b.consultationFee)
        break
      default:
        break
    }

    return filtered
  }

  // Fetch doctors function
  const fetchDoctors = async () => {
    setLoading(true)
    setError(null)

    try {
      console.log("Attempting to fetch doctors...")

      const queryParams = new URLSearchParams({
        location: location || "",
        specialty: specialty || "",
        gender: filters.gender || "all",
        experience: filters.experience || "all",
        sortBy: filters.sortBy || "relevance",
      })

      const response = await fetch(`/api/doctors?${queryParams.toString()}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        const data = await response.json()
        console.log("API response received:", data)

        if (data.success && Array.isArray(data.doctors)) {
          setDoctors(data.doctors)
        } else {
          throw new Error("Invalid API response")
        }
      } else {
        throw new Error(`API error: ${response.status}`)
      }
    } catch (error) {
      console.error("API failed, using fallback data:", error)
      // Use fallback data and filter locally
      const filteredDoctors = filterDoctors(fallbackDoctors)
      setDoctors(filteredDoctors)
      setError(null) // Don't show error since we have fallback data
    } finally {
      setLoading(false)
    }
  }

  // Initialize from URL params and load data
  useEffect(() => {
    const urlLocation = searchParams.get("location")
    const urlSpecialty = searchParams.get("specialty")

    if (urlLocation) setLocation(urlLocation)
    if (urlSpecialty) setSpecialty(urlSpecialty)

    // Load doctors after a short delay to ensure state is set
    const timer = setTimeout(() => {
      fetchDoctors()
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  // Refetch when search params change
  useEffect(() => {
    if (!loading) {
      fetchDoctors()
    }
  }, [location, specialty, filters])

  const handleSearch = () => {
    const url = new URL(window.location.href)
    url.searchParams.set("location", location)
    url.searchParams.set("specialty", specialty)
    window.history.pushState({}, "", url.toString())
    fetchDoctors()
  }

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Search Bar */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex items-center border rounded-lg px-4 py-2 bg-gray-50 md:w-1/3">
              <MapPin className="h-5 w-5 text-gray-400 mr-2" />
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="border-0 bg-transparent p-0 focus-visible:ring-0"
                placeholder="Location"
              />
            </div>
            <div className="flex items-center border rounded-lg px-4 py-2 flex-1">
              <Search className="h-5 w-5 text-gray-400 mr-2" />
              <Input
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="border-0 p-0 focus-visible:ring-0"
                placeholder="Search specialty"
              />
            </div>
            <Button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700">
              Search
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-blue-800 text-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap gap-4 items-center">
            <Select value={filters.gender} onValueChange={(value) => handleFilterChange("gender", value)}>
              <SelectTrigger className="w-32 bg-blue-700 border-blue-600 text-white">
                <SelectValue placeholder="Gender" />
                <ChevronDown className="h-4 w-4" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.experience} onValueChange={(value) => handleFilterChange("experience", value)}>
              <SelectTrigger className="w-40 bg-blue-700 border-blue-600 text-white">
                <SelectValue placeholder="Experience" />
                <ChevronDown className="h-4 w-4" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="0-5">0-5 years</SelectItem>
                <SelectItem value="5-10">5-10 years</SelectItem>
                <SelectItem value="10+">10+ years</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="bg-blue-700 border-blue-600 text-white hover:bg-blue-600">
              Patient Stories
              <ChevronDown className="h-4 w-4 ml-1" />
            </Button>

            <Button variant="outline" className="bg-blue-700 border-blue-600 text-white hover:bg-blue-600">
              All Filters
              <ChevronDown className="h-4 w-4 ml-1" />
            </Button>

            <div className="ml-auto flex items-center gap-2">
              <span className="text-sm">Sort By</span>
              <Select value={filters.sortBy} onValueChange={(value) => handleFilterChange("sortBy", value)}>
                <SelectTrigger className="w-32 bg-blue-700 border-blue-600 text-white">
                  <SelectValue />
                  <ChevronDown className="h-4 w-4" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="experience">Experience</SelectItem>
                  <SelectItem value="fee">Fee</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {loading
              ? "Searching for doctors..."
              : error
                ? "Error loading doctors"
                : `${doctors.length} ${specialty}${doctors.length !== 1 ? "s" : ""} available in ${location}`}
          </h1>
          <div className="flex items-center text-gray-600">
            <div className="w-6 h-6 border-2 border-gray-400 rounded-full flex items-center justify-center mr-2">
              <div className="w-3 h-3 border-l-2 border-gray-600 rounded-full"></div>
            </div>
            <span>Book appointments with minimum wait-time & verified doctor details</span>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Loading doctors...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 text-lg mb-2">Error: {error}</p>
            <Button onClick={fetchDoctors} className="bg-blue-600 hover:bg-blue-700">
              Try Again
            </Button>
          </div>
        ) : doctors.length > 0 ? (
          <div className="space-y-6">
            {doctors.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No doctors found matching your criteria.</p>
            <p className="text-gray-500 mt-2">Try adjusting your search or filters.</p>
            <Button
              onClick={() => {
                setLocation("JP Nagar")
                setSpecialty("Dermatologist")
                setFilters({ gender: "all", experience: "all", sortBy: "relevance" })
                fetchDoctors()
              }}
              className="mt-4 bg-blue-600 hover:bg-blue-700"
            >
              Reset Search
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
