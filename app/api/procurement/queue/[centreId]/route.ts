import { NextResponse } from "next/server";
import { buildLiveQueueState } from "@/lib/data/procurement";

export async function GET(
  request: Request,
  { params }: { params: { centreId: string } }
) {
  const { centreId } = params;
  const queueState = buildLiveQueueState(centreId, 130, 142);

  return NextResponse.json({
    success: true,
    data: queueState,
  });
}
