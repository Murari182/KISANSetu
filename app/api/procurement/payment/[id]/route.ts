import { NextResponse } from "next/server";
import { INITIAL_DEFAULT_PAYMENT } from "@/lib/data/procurement";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  const payment = {
    ...INITIAL_DEFAULT_PAYMENT,
    id: id || INITIAL_DEFAULT_PAYMENT.id,
  };

  return NextResponse.json({
    success: true,
    data: payment,
  });
}
