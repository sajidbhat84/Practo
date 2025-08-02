import { DoctorService } from "../lib/services/doctorService"

async function seedDatabase() {
  try {
    console.log("Starting database seeding...")
    await DoctorService.seedDatabase()
    console.log("Database seeded successfully!")
    process.exit(0)
  } catch (error) {
    console.error("Error seeding database:", error)
    process.exit(1)
  }
}

seedDatabase()
