import { type NextRequest, NextResponse } from "next/server"

// Fallback data when MongoDB is not available
const fallbackDoctors = [
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
    gender: "male",
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
    gender: "female",
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
    gender: "male",
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
    gender: "female",
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
    gender: "female",
  },
  {
    id: "6",
    name: "Dr. Arjun Nair",
    specialty: "Cardiologist",
    experience: 20,
    location: "JP Nagar, Bangalore",
    clinicName: "Heart Care Center",
    consultationFee: 1200,
    rating: 96,
    patientStories: 1340,
    availableToday: true,
    gender: "male",
  },
]

// Filter function for fallback data
function filterDoctors(doctors: any[], filters: any) {
  let filtered = [...doctors]

  // Filter by specialty
  if (filters.specialty && filters.specialty.trim()) {
    const searchTerm = filters.specialty.toLowerCase().trim()
    filtered = filtered.filter(
      (doctor) =>
        doctor.specialty.toLowerCase().includes(searchTerm) ||
        doctor.name.toLowerCase().includes(searchTerm) ||
        doctor.clinicName.toLowerCase().includes(searchTerm),
    )
  }

  // Filter by location
  if (filters.location && filters.location.trim()) {
    const searchTerm = filters.location.toLowerCase().trim()
    filtered = filtered.filter(
      (doctor) =>
        doctor.location.toLowerCase().includes(searchTerm) || doctor.location.toLowerCase().includes("bangalore"),
    )
  }

  // Filter by gender
  if (filters.gender && filters.gender !== "all") {
    filtered = filtered.filter((doctor) => doctor.gender === filters.gender)
  }

  // Filter by experience
  if (filters.experience && filters.experience !== "all") {
    if (filters.experience === "0-5") {
      filtered = filtered.filter((doctor) => doctor.experience >= 0 && doctor.experience <= 5)
    } else if (filters.experience === "5-10") {
      filtered = filtered.filter((doctor) => doctor.experience > 5 && doctor.experience <= 10)
    } else if (filters.experience === "10+") {
      filtered = filtered.filter((doctor) => doctor.experience > 10)
    }
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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const filters = {
      specialty: searchParams.get("specialty") || "",
      location: searchParams.get("location") || "",
      gender: searchParams.get("gender") || "all",
      experience: searchParams.get("experience") || "all",
      sortBy: searchParams.get("sortBy") || "relevance",
    }

    console.log("API called with filters:", filters)

    // Try MongoDB first, fallback to static data
    try {
      const { DoctorService } = await import("@/lib/services/doctorService")

      const { doctors, total } = await DoctorService.getAllDoctors(
        {
          specialty: filters.specialty || undefined,
          location: filters.location || undefined,
          gender: (filters.gender as "male" | "female" | "all") || "all",
          experience: filters.experience || undefined,
        },
        {
          field: (filters.sortBy as "relevance" | "rating" | "experience" | "fee") || "relevance",
          order: "desc",
        },
      )

      return NextResponse.json({
        success: true,
        doctors: doctors.map((doctor) => ({
          id: doctor._id?.toString(),
          name: doctor.name,
          specialty: doctor.specialty,
          experience: doctor.experience,
          location: doctor.location,
          clinicName: doctor.clinicName,
          consultationFee: doctor.fee,
          rating: doctor.rating,
          patientStories: doctor.patientStories,
          image: doctor.image,
          availableToday: doctor.availableToday,
          clinicLogo: doctor.clinicLogo,
        })),
        total,
        source: "mongodb",
      })
    } catch (mongoError) {
      console.log("MongoDB not available, using fallback data:", mongoError.message)

      // Use fallback data
      const filteredDoctors = filterDoctors(fallbackDoctors, filters)

      return NextResponse.json({
        success: true,
        doctors: filteredDoctors,
        total: filteredDoctors.length,
        source: "fallback",
      })
    }
  } catch (error) {
    console.error("Error in doctors API:", error)

    // Even if everything fails, return fallback data
    const filteredDoctors = filterDoctors(fallbackDoctors, {
      specialty: "",
      location: "",
      gender: "all",
      experience: "all",
      sortBy: "relevance",
    })

    return NextResponse.json({
      success: true,
      doctors: filteredDoctors,
      total: filteredDoctors.length,
      source: "emergency_fallback",
    })
  }
}

export async function POST(request: NextRequest) {
  try {
    const doctorData = await request.json()
    const { DoctorService } = await import("@/lib/services/doctorService")
    const doctor = await DoctorService.createDoctor(doctorData)

    return NextResponse.json({
      success: true,
      doctor: {
        id: doctor._id?.toString(),
        ...doctor,
      },
    })
  } catch (error) {
    console.error("Error creating doctor:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create doctor",
      },
      { status: 500 },
    )
  }
}
