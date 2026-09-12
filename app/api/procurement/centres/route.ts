import { NextResponse } from "next/server";
import { DEFAULT_PROCUREMENT_CENTRES } from "@/lib/data/procurement";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const district = searchParams.get("district");

  let centres = DEFAULT_PROCUREMENT_CENTRES;
  if (district) {
    centres = centres.filter(
      (c) => c.district.toLowerCase() === district.toLowerCase()
    );
  }

  return NextResponse.json({
    success: true,
    count: centres.length,
    data: centres,
  });
}
