import { NextResponse } from "next/server"
import { DoctorService } from "@/lib/services/doctorService"

export async function POST() {
  try {
    await DoctorService.seedDatabase()

    return NextResponse.json({
      success: true,
      message: "Database seeded successfully",
    })
  } catch (error) {
    console.error("Error seeding database:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to seed database",
      },
      { status: 500 },
    )
  }
}
