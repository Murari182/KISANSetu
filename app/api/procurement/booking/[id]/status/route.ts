import { NextResponse } from "next/server";
import { INITIAL_DEFAULT_BOOKING } from "@/lib/data/procurement";
import { ProcurementJourneyStage } from "@/types";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { stage, details } = body as {
      stage: ProcurementJourneyStage;
      details?: string;
    };

    const updated = {
      ...INITIAL_DEFAULT_BOOKING,
      id,
      stage,
      stageDetails: details || `Stage updated to ${stage}`,
    };

    return NextResponse.json({
      success: true,
      message: `Booking status updated to ${stage}`,
      data: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update status" },
      { status: 400 }
    );
  }
}
