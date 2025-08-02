import { getDatabase } from "../mongodb"
import type { Doctor, DoctorFilter, DoctorSort } from "../models/Doctor"
import { ObjectId } from "mongodb"

export class DoctorService {
  private static async getCollection() {
    const db = await getDatabase()
    return db.collection<Doctor>("doctors")
  }

  static async getAllDoctors(
    filter: DoctorFilter = {},
    sort: DoctorSort = { field: "relevance", order: "desc" },
    limit = 50,
    skip = 0,
  ): Promise<{ doctors: Doctor[]; total: number }> {
    try {
      const collection = await this.getCollection()

      // Build MongoDB query
      const query: any = {}

      if (filter.specialty) {
        query.$or = [
          { specialty: { $regex: filter.specialty, $options: "i" } },
          { name: { $regex: filter.specialty, $options: "i" } },
          { clinicName: { $regex: filter.specialty, $options: "i" } },
        ]
      }

      if (filter.location) {
        query.location = { $regex: filter.location, $options: "i" }
      }

      if (filter.gender && filter.gender !== "all") {
        query.gender = filter.gender
      }

      if (filter.experience) {
        if (filter.experience === "0-5") {
          query.experience = { $gte: 0, $lte: 5 }
        } else if (filter.experience === "5-10") {
          query.experience = { $gt: 5, $lte: 10 }
        } else if (filter.experience === "10+") {
          query.experience = { $gt: 10 }
        }
      }

      if (filter.minRating) {
        query.rating = { $gte: filter.minRating }
      }

      if (filter.maxFee) {
        query.fee = { $lte: filter.maxFee }
      }

      if (filter.availableToday) {
        query.availableToday = true
      }

      // Build sort query
      const sortQuery: any = {}
      switch (sort.field) {
        case "rating":
          sortQuery.rating = sort.order === "desc" ? -1 : 1
          break
        case "experience":
          sortQuery.experience = sort.order === "desc" ? -1 : 1
          break
        case "fee":
          sortQuery.fee = sort.order === "desc" ? -1 : 1
          break
        default:
          sortQuery.rating = -1 // Default sort by rating
          break
      }

      console.log("MongoDB Query:", JSON.stringify(query, null, 2))
      console.log("MongoDB Sort:", JSON.stringify(sortQuery, null, 2))

      const [doctors, total] = await Promise.all([
        collection.find(query).sort(sortQuery).skip(skip).limit(limit).toArray(),
        collection.countDocuments(query),
      ])

      return { doctors, total }
    } catch (error) {
      console.error("Error fetching doctors from MongoDB:", error)
      throw new Error("Failed to fetch doctors from database")
    }
  }

  static async getDoctorById(id: string): Promise<Doctor | null> {
    try {
      const collection = await this.getCollection()
      const doctor = await collection.findOne({ _id: new ObjectId(id) })
      return doctor
    } catch (error) {
      console.error("Error fetching doctor by ID:", error)
      return null
    }
  }

  static async createDoctor(doctorData: Omit<Doctor, "_id" | "createdAt" | "updatedAt">): Promise<Doctor> {
    try {
      const collection = await this.getCollection()
      const now = new Date()

      const doctor: Omit<Doctor, "_id"> = {
        ...doctorData,
        createdAt: now,
        updatedAt: now,
      }

      const result = await collection.insertOne(doctor as Doctor)
      const createdDoctor = await collection.findOne({ _id: result.insertedId })

      if (!createdDoctor) {
        throw new Error("Failed to create doctor")
      }

      return createdDoctor
    } catch (error) {
      console.error("Error creating doctor:", error)
      throw new Error("Failed to create doctor")
    }
  }

  static async updateDoctor(id: string, updateData: Partial<Doctor>): Promise<Doctor | null> {
    try {
      const collection = await this.getCollection()

      const result = await collection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        {
          $set: {
            ...updateData,
            updatedAt: new Date(),
          },
        },
        { returnDocument: "after" },
      )

      return result.value
    } catch (error) {
      console.error("Error updating doctor:", error)
      return null
    }
  }

  static async deleteDoctor(id: string): Promise<boolean> {
    try {
      const collection = await this.getCollection()
      const result = await collection.deleteOne({ _id: new ObjectId(id) })
      return result.deletedCount === 1
    } catch (error) {
      console.error("Error deleting doctor:", error)
      return false
    }
  }

  static async seedDatabase(): Promise<void> {
    try {
      const collection = await this.getCollection()
      const count = await collection.countDocuments()

      if (count > 0) {
        console.log("Database already seeded")
        return
      }

      const sampleDoctors: Omit<Doctor, "_id" | "createdAt" | "updatedAt">[] = [
        {
          name: "Dr. Aesthetic Heart",
          specialty: "Dermatologist",
          experience: 12,
          rating: 97,
          fee: 800,
          location: "Jayanagar, Bangalore",
          clinicName: "Aesthetic Heart Dermatology & Cardiology Clinic",
          patientStories: 159,
          availableToday: false,
          clinicLogo: "/placeholder.svg?height=60&width=60&text=AH",
          gender: "male",
          availability: {
            monday: [{ startTime: "09:00", endTime: "17:00", isAvailable: true }],
            tuesday: [{ startTime: "09:00", endTime: "17:00", isAvailable: true }],
            wednesday: [{ startTime: "09:00", endTime: "17:00", isAvailable: true }],
            thursday: [{ startTime: "09:00", endTime: "17:00", isAvailable: true }],
            friday: [{ startTime: "09:00", endTime: "17:00", isAvailable: true }],
            saturday: [{ startTime: "09:00", endTime: "13:00", isAvailable: true }],
            sunday: [],
          },
          qualifications: ["MBBS", "MD Dermatology"],
          languages: ["English", "Hindi", "Kannada"],
          phone: "+91-9876543210",
          email: "dr.aesthetic@clinic.com",
          address: "123 Jayanagar, Bangalore - 560011",
        },
        {
          name: "Dr. Sheelavathi Natraj",
          specialty: "Dermatologist",
          experience: 21,
          rating: 94,
          fee: 800,
          location: "JP Nagar, Bangalore",
          clinicName: "Sapphire Skin And Aesthetics Clinic",
          patientStories: 1506,
          image: "/placeholder.svg?height=80&width=80&text=SN",
          availableToday: true,
          gender: "female",
          availability: {
            monday: [{ startTime: "10:00", endTime: "18:00", isAvailable: true }],
            tuesday: [{ startTime: "10:00", endTime: "18:00", isAvailable: true }],
            wednesday: [{ startTime: "10:00", endTime: "18:00", isAvailable: true }],
            thursday: [{ startTime: "10:00", endTime: "18:00", isAvailable: true }],
            friday: [{ startTime: "10:00", endTime: "18:00", isAvailable: true }],
            saturday: [{ startTime: "10:00", endTime: "14:00", isAvailable: true }],
            sunday: [],
          },
          qualifications: ["MBBS", "MD Dermatology", "Fellowship in Cosmetic Dermatology"],
          languages: ["English", "Hindi", "Kannada", "Tamil"],
          phone: "+91-9876543211",
          email: "dr.sheelavathi@sapphire.com",
          address: "456 JP Nagar, Bangalore - 560078",
        },
        {
          name: "Dr. Rajesh Kumar",
          specialty: "Dermatologist",
          experience: 15,
          rating: 92,
          fee: 600,
          location: "JP Nagar, Bangalore",
          clinicName: "Skin Care Clinic",
          patientStories: 890,
          availableToday: true,
          gender: "male",
          availability: {
            monday: [{ startTime: "09:00", endTime: "17:00", isAvailable: true }],
            tuesday: [{ startTime: "09:00", endTime: "17:00", isAvailable: true }],
            wednesday: [{ startTime: "09:00", endTime: "17:00", isAvailable: true }],
            thursday: [{ startTime: "09:00", endTime: "17:00", isAvailable: true }],
            friday: [{ startTime: "09:00", endTime: "17:00", isAvailable: true }],
            saturday: [{ startTime: "09:00", endTime: "13:00", isAvailable: true }],
            sunday: [],
          },
          qualifications: ["MBBS", "MD Dermatology"],
          languages: ["English", "Hindi"],
          phone: "+91-9876543212",
          email: "dr.rajesh@skincare.com",
          address: "789 JP Nagar, Bangalore - 560078",
        },
        {
          name: "Dr. Priya Sharma",
          specialty: "Pediatrician",
          experience: 8,
          rating: 96,
          fee: 500,
          location: "Jayanagar, Bangalore",
          clinicName: "Child Care Center",
          patientStories: 445,
          availableToday: false,
          gender: "female",
          availability: {
            monday: [{ startTime: "08:00", endTime: "16:00", isAvailable: true }],
            tuesday: [{ startTime: "08:00", endTime: "16:00", isAvailable: true }],
            wednesday: [{ startTime: "08:00", endTime: "16:00", isAvailable: true }],
            thursday: [{ startTime: "08:00", endTime: "16:00", isAvailable: true }],
            friday: [{ startTime: "08:00", endTime: "16:00", isAvailable: true }],
            saturday: [{ startTime: "08:00", endTime: "12:00", isAvailable: true }],
            sunday: [],
          },
          qualifications: ["MBBS", "MD Pediatrics"],
          languages: ["English", "Hindi", "Kannada"],
          phone: "+91-9876543213",
          email: "dr.priya@childcare.com",
          address: "321 Jayanagar, Bangalore - 560011",
        },
        {
          name: "Dr. Meera Joshi",
          specialty: "Pediatrician",
          experience: 12,
          rating: 95,
          fee: 600,
          location: "Whitefield, Bangalore",
          clinicName: "Little Angels Clinic",
          patientStories: 623,
          availableToday: true,
          gender: "female",
          availability: {
            monday: [{ startTime: "09:00", endTime: "17:00", isAvailable: true }],
            tuesday: [{ startTime: "09:00", endTime: "17:00", isAvailable: true }],
            wednesday: [{ startTime: "09:00", endTime: "17:00", isAvailable: true }],
            thursday: [{ startTime: "09:00", endTime: "17:00", isAvailable: true }],
            friday: [{ startTime: "09:00", endTime: "17:00", isAvailable: true }],
            saturday: [{ startTime: "09:00", endTime: "13:00", isAvailable: true }],
            sunday: [],
          },
          qualifications: ["MBBS", "MD Pediatrics", "Fellowship in Neonatology"],
          languages: ["English", "Hindi", "Marathi"],
          phone: "+91-9876543214",
          email: "dr.meera@littleangels.com",
          address: "654 Whitefield, Bangalore - 560066",
        },
        {
          name: "Dr. Arjun Nair",
          specialty: "Cardiologist",
          experience: 20,
          rating: 96,
          fee: 1200,
          location: "JP Nagar, Bangalore",
          clinicName: "Heart Care Center",
          patientStories: 1340,
          availableToday: true,
          gender: "male",
          availability: {
            monday: [{ startTime: "10:00", endTime: "18:00", isAvailable: true }],
            tuesday: [{ startTime: "10:00", endTime: "18:00", isAvailable: true }],
            wednesday: [{ startTime: "10:00", endTime: "18:00", isAvailable: true }],
            thursday: [{ startTime: "10:00", endTime: "18:00", isAvailable: true }],
            friday: [{ startTime: "10:00", endTime: "18:00", isAvailable: true }],
            saturday: [{ startTime: "10:00", endTime: "14:00", isAvailable: true }],
            sunday: [],
          },
          qualifications: ["MBBS", "MD Cardiology", "DM Interventional Cardiology"],
          languages: ["English", "Hindi", "Malayalam"],
          phone: "+91-9876543215",
          email: "dr.arjun@heartcare.com",
          address: "987 JP Nagar, Bangalore - 560078",
        },
      ]

      await collection.insertMany(
        sampleDoctors.map((doctor) => ({
          ...doctor,
          createdAt: new Date(),
          updatedAt: new Date(),
        })),
      )

      console.log("Database seeded successfully with sample doctors")
    } catch (error) {
      console.error("Error seeding database:", error)
      throw new Error("Failed to seed database")
    }
  }
}
