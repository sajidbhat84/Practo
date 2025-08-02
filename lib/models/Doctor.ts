import type { ObjectId } from "mongodb"

export interface Doctor {
  _id?: ObjectId
  name: string
  specialty: string
  experience: number
  rating: number
  fee: number
  location: string
  clinicName: string
  patientStories: number
  image?: string
  availableToday: boolean
  clinicLogo?: string
  gender: "male" | "female"
  availability: {
    monday: TimeSlot[]
    tuesday: TimeSlot[]
    wednesday: TimeSlot[]
    thursday: TimeSlot[]
    friday: TimeSlot[]
    saturday: TimeSlot[]
    sunday: TimeSlot[]
  }
  qualifications: string[]
  languages: string[]
  phone: string
  email: string
  address: string
  createdAt: Date
  updatedAt: Date
}

export interface TimeSlot {
  startTime: string // "09:00"
  endTime: string // "17:00"
  isAvailable: boolean
}

export interface DoctorFilter {
  specialty?: string
  location?: string
  gender?: "male" | "female" | "all"
  experience?: string
  minRating?: number
  maxFee?: number
  availableToday?: boolean
}

export interface DoctorSort {
  field: "relevance" | "rating" | "experience" | "fee"
  order: "asc" | "desc"
}
