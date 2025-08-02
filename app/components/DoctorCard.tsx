import { Clock, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

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

interface DoctorCardProps {
  doctor: Doctor
}

export default function DoctorCard({ doctor }: DoctorCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left side - Clinic/Doctor info */}
        <div className="flex gap-4 flex-1">
          {/* Clinic Logo or Doctor Image */}
          <div className="flex-shrink-0">
            {doctor.image ? (
              <div className="w-20 h-20 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center">
                <Image
                  src={doctor.image || "/placeholder.svg"}
                  alt={doctor.name}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : doctor.clinicLogo ? (
              <div className="w-20 h-20 bg-yellow-100 rounded-lg flex items-center justify-center">
                <span className="text-yellow-600 font-bold text-sm text-center">
                  {doctor.clinicName
                    .split(" ")
                    .map((word) => word[0])
                    .join("")
                    .slice(0, 3)}
                </span>
              </div>
            ) : (
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold text-lg">
                  {doctor.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </span>
              </div>
            )}
          </div>

          {/* Doctor Details */}
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-blue-600 mb-1">{doctor.clinicName || doctor.name}</h3>

            {doctor.clinicName && <p className="text-gray-600 mb-1">{doctor.name}</p>}

            <p className="text-gray-600 mb-2">{doctor.specialty}</p>
            <p className="text-gray-600 mb-2">{doctor.experience} years experience overall</p>
            <p className="text-gray-600 mb-3">{doctor.location}</p>
            <p className="text-gray-800 font-semibold mb-3">₹{doctor.consultationFee} Consultation fee at clinic</p>

            {/* Rating and Patient Stories */}
            <div className="flex items-center gap-4">
              <div className="flex items-center bg-green-500 text-white px-2 py-1 rounded text-sm">
                <span className="mr-1">👍</span>
                <span>{doctor.rating}%</span>
              </div>
              <span className="text-gray-600 text-sm underline cursor-pointer">
                {doctor.patientStories} Patient Stories
              </span>
            </div>
          </div>
        </div>

        {/* Right side - Booking */}
        <div className="flex flex-col gap-3 lg:w-64">
          {doctor.availableToday && (
            <div className="flex items-center text-green-600 text-sm mb-2">
              <Clock className="h-4 w-4 mr-1" />
              <span>Available Today</span>
            </div>
          )}

          <Button className="bg-blue-500 hover:bg-blue-600 text-white">
            Book Clinic Visit
            {!doctor.availableToday && <div className="text-xs mt-1">No Booking Fee</div>}
          </Button>

          <Button variant="outline" className="text-blue-500 border-blue-500 hover:bg-blue-50 bg-transparent">
            <Phone className="h-4 w-4 mr-2" />
            Contact Clinic
          </Button>
        </div>
      </div>
    </div>
  )
}
