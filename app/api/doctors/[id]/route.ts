import { type NextRequest, NextResponse } from "next/server"
import { DoctorService } from "@/lib/services/doctorService"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const doctor = await DoctorService.getDoctorById(params.id)

    if (!doctor) {
      return NextResponse.json(
        {
          success: false,
          error: "Doctor not found",
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      doctor: {
        id: doctor._id?.toString(),
        ...doctor,
      },
    })
  } catch (error) {
    console.error("Error fetching doctor:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch doctor",
      },
      { status: 500 },
    )
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const updateData = await request.json()
    const doctor = await DoctorService.updateDoctor(params.id, updateData)

    if (!doctor) {
      return NextResponse.json(
        {
          success: false,
          error: "Doctor not found",
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      doctor: {
        id: doctor._id?.toString(),
        ...doctor,
      },
    })
  } catch (error) {
    console.error("Error updating doctor:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update doctor",
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const success = await DoctorService.deleteDoctor(params.id)

    if (!success) {
      return NextResponse.json(
        {
          success: false,
          error: "Doctor not found",
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Doctor deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting doctor:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete doctor",
      },
      { status: 500 },
    )
  }
}
