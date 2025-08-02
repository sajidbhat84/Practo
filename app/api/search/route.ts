import { type NextRequest, NextResponse } from "next/server"

const specialties = [
  "Dermatologist",
  "Pediatrician",
  "Gynecologist",
  "Orthopedist",
  "Cardiologist",
  "Neurologist",
  "Psychiatrist",
  "Ophthalmologist",
  "ENT Specialist",
  "General Physician",
]

const locations = [
  "Bangalore",
  "JP Nagar",
  "Jayanagar",
  "Koramangala",
  "Indiranagar",
  "Whitefield",
  "Electronic City",
  "Marathahalli",
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q") || ""
    const type = searchParams.get("type") || "all" // 'specialty', 'location', or 'all'

    let suggestions: string[] = []

    if (type === "specialty" || type === "all") {
      const matchingSpecialties = specialties.filter((specialty) =>
        specialty.toLowerCase().includes(query.toLowerCase()),
      )
      suggestions = [...suggestions, ...matchingSpecialties]
    }

    if (type === "location" || type === "all") {
      const matchingLocations = locations.filter((location) => location.toLowerCase().includes(query.toLowerCase()))
      suggestions = [...suggestions, ...matchingLocations]
    }

    return NextResponse.json({
      suggestions: suggestions.slice(0, 10), // Limit to 10 suggestions
    })
  } catch (error) {
    console.error("Error fetching search suggestions:", error)
    return NextResponse.json({ error: "Failed to fetch suggestions" }, { status: 500 })
  }
}
