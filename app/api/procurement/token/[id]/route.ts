import { NextResponse } from "next/server";
import { INITIAL_DEFAULT_BOOKING } from "@/lib/data/procurement";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  // In prototype, return the demo booking with matched id/token
  const booking = {
    ...INITIAL_DEFAULT_BOOKING,
    id: id || INITIAL_DEFAULT_BOOKING.id,
  };

  return NextResponse.json({
    success: true,
    data: booking,
  });
}
