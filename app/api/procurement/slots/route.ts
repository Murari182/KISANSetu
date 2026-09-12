import { NextResponse } from "next/server";
import { generateDailySlots } from "@/lib/data/procurement";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const centreId = searchParams.get("centreId") || "centre-mandal";
  const date = searchParams.get("date") || "2026-09-12";

  const slots = generateDailySlots(centreId, date);

  return NextResponse.json({
    success: true,
    centreId,
    date,
    count: slots.length,
    data: slots,
  });
}
