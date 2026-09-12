import { NextResponse } from "next/server";
import { DEFAULT_PROCUREMENT_CENTRES } from "@/lib/data/procurement";
import { ProcurementBooking } from "@/types";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      farmerName = "Rameshwar Prasad Patel",
      farmerPhone = "+91 98765 43210",
      farmName = "Lucknow Shivalik Farm",
      cropName = "Basmati Paddy (धान)",
      commodity = "Paddy",
      variety = "Pusa Basmati 1121",
      estimatedQuantityKg = 1480,
      centreId = "centre-mandal",
      date = "12 September 2026",
      slotTime = "10:30 AM – 11:00 AM",
    } = body;

    const centre =
      DEFAULT_PROCUREMENT_CENTRES.find((c) => c.id === centreId) ||
      DEFAULT_PROCUREMENT_CENTRES[0];

    const randomNum = Math.floor(140 + Math.random() * 40);
    const tokenNumber = `A${randomNum}`;
    const queuePosition = randomNum - 130;
    const estimatedWaitMinutes = Math.max(
      6,
      Math.round((queuePosition / centre.activeCounters) * centre.avgProcessingTimeMinutes)
    );

    const booking: ProcurementBooking = {
      id: `book-${Date.now()}`,
      bookingCode: `KS-PROC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      farmerId: "usr-farmer-101",
      farmerName,
      farmerPhone,
      farmId: "farm-1",
      farmName,
      cropName,
      commodity,
      variety,
      estimatedQuantityKg,
      centreId: centre.id,
      centreName: centre.name,
      centreAddress: centre.address,
      date,
      slotTime,
      tokenNumber,
      queuePosition,
      estimatedWaitMinutes,
      stage: "TOKEN_GENERATED",
      stageDetails: "Slot confirmed. Digital token active. Arrive with certainty at scheduled time.",
      recommendedArrivalTime: "10:20 AM",
      createdAt: new Date().toISOString(),
      actualQuantityKg: estimatedQuantityKg,
      mspPerQuintal: 2300,
      totalAmount: Math.round((estimatedQuantityKg / 100) * 2300),
      paymentStatus: "PENDING",
      transactionId: `KS-DBT-${Math.floor(100000 + Math.random() * 900000)}`,
      bankAccountMasked: "SBI •••• 4092",
      securityHash: `SHA256:${Math.random().toString(36).substring(2, 12)}`,
    };

    return NextResponse.json({
      success: true,
      message: "Procurement slot booked successfully. Digital token generated.",
      data: booking,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to book slot" },
      { status: 400 }
    );
  }
}
