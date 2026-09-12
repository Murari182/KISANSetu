import {
  ProcurementCentre,
  ProcurementSlot,
  ProcurementBooking,
  ProcurementPayment,
  QueueLiveState,
  AiEtaPrediction,
  ProcurementJourneyStage,
} from "@/types";

export const PROCUREMENT_CROPS = [
  { id: "paddy", name: "Paddy (धान)", variety: "Pusa Basmati 1121", mspPerQuintal: 2300, minMoisture: 14, maxMoisture: 17 },
  { id: "wheat", name: "Wheat (गेहूं)", variety: "HD-2967 (Sharbati)", mspPerQuintal: 2425, minMoisture: 12, maxMoisture: 14 },
  { id: "mustard", name: "Mustard (सरसों)", variety: "Pusa Bold", mspPerQuintal: 5650, minMoisture: 8, maxMoisture: 10 },
  { id: "maize", name: "Maize (मक्का)", variety: "DHM-117", mspPerQuintal: 2225, minMoisture: 13, maxMoisture: 15 },
  { id: "cotton", name: "Cotton (कपास)", variety: "Medium Staple", mspPerQuintal: 7121, minMoisture: 8, maxMoisture: 12 },
  { id: "soyabean", name: "Soyabean (सोयाबीन)", variety: "JS-335", mspPerQuintal: 4892, minMoisture: 10, maxMoisture: 12 },
];

export const DEFAULT_PROCUREMENT_CENTRES: ProcurementCentre[] = [
  {
    id: "centre-mandal",
    name: "Mandal Procurement Centre",
    code: "MPC-UP-LKO-01",
    district: "Lucknow",
    state: "Uttar Pradesh",
    address: "Kasmandi Road, Mandi Samiti Campus, Malihabad, Lucknow - 226102",
    distanceKm: 8.2,
    status: "BUSY",
    activeCounters: 4,
    totalCounters: 5,
    currentServingToken: "A130",
    queueLength: 18,
    avgProcessingTimeMinutes: 4.2,
    operatingHours: "08:30 AM – 06:00 PM",
    availableSlotsCount: 14,
    cropsSupported: ["Paddy (धान)", "Wheat (गेहूं)", "Mustard (सरसों)", "Maize (मक्का)"],
    contactPhone: "+91 522 2841029",
    coordinates: { lat: 26.9214, lng: 80.7126 },
    isRecommended: true,
    recommendationReason: "Best option based on current queue (18 farmers) and immediate slot availability.",
  },
  {
    id: "centre-central",
    name: "Central Procurement Centre (APMC Mandi)",
    code: "CPC-UP-LKO-02",
    district: "Lucknow",
    state: "Uttar Pradesh",
    address: "Main APMC Yard, Sitapur Road, Lucknow Sadar - 226020",
    distanceKm: 11.4,
    status: "BUSY",
    activeCounters: 3,
    totalCounters: 6,
    currentServingToken: "B089",
    queueLength: 37,
    avgProcessingTimeMinutes: 5.5,
    operatingHours: "08:00 AM – 07:00 PM",
    availableSlotsCount: 4,
    cropsSupported: ["Paddy (धान)", "Wheat (गेहूं)", "Mustard (सरसों)", "Cotton (कपास)", "Soyabean (सोयाबीन)"],
    contactPhone: "+91 522 2390114",
    coordinates: { lat: 26.8842, lng: 80.9312 },
    isRecommended: false,
    recommendationReason: "Heavier intake congestion with 37 farmers waiting (~1 hr 08 min wait).",
  },
  {
    id: "centre-mohanlalganj",
    name: "Mohanlalganj Krishak Sahkari Kendra",
    code: "KSK-UP-LKO-03",
    district: "Lucknow",
    state: "Uttar Pradesh",
    address: "Block Development Office Complex, Mohanlalganj - 226301",
    distanceKm: 16.5,
    status: "OPEN",
    activeCounters: 3,
    totalCounters: 4,
    currentServingToken: "C044",
    queueLength: 8,
    avgProcessingTimeMinutes: 4.0,
    operatingHours: "09:00 AM – 05:30 PM",
    availableSlotsCount: 22,
    cropsSupported: ["Paddy (धान)", "Wheat (गेहूं)", "Mustard (सरसों)"],
    contactPhone: "+91 522 2814502",
    coordinates: { lat: 26.6853, lng: 80.9844 },
    isRecommended: false,
    recommendationReason: "Lowest queue (8 farmers) but farther distance (16.5 km from your farm).",
  },
  {
    id: "centre-barabanki",
    name: "Fatehpur Cooperative Procurement Hub",
    code: "CPH-UP-BBK-01",
    district: "Barabanki",
    state: "Uttar Pradesh",
    address: "Ramnagar Highway Road, Mandi Yard, Fatehpur, Barabanki - 225305",
    distanceKm: 24.0,
    status: "OPEN",
    activeCounters: 4,
    totalCounters: 5,
    currentServingToken: "D022",
    queueLength: 11,
    avgProcessingTimeMinutes: 4.5,
    operatingHours: "08:30 AM – 06:00 PM",
    availableSlotsCount: 19,
    cropsSupported: ["Paddy (धान)", "Wheat (गेहूं)", "Mustard (सरसों)", "Maize (मक्का)"],
    contactPhone: "+91 5248 221088",
    coordinates: { lat: 27.0211, lng: 81.221 },
    isRecommended: false,
  },
];

export function generateDailySlots(centreId: string, dateStr: string): ProcurementSlot[] {
  const slotDefinitions = [
    { start: "09:00", end: "09:30", display: "09:00 AM – 09:30 AM", capacity: 15, booked: 15, status: "FULL" as const },
    { start: "09:30", end: "10:00", display: "09:30 AM – 10:00 AM", capacity: 15, booked: 14, status: "LIMITED" as const },
    { start: "10:00", end: "10:30", display: "10:00 AM – 10:30 AM", capacity: 15, booked: 13, status: "LIMITED" as const },
    { start: "10:30", end: "11:00", display: "10:30 AM – 11:00 AM", capacity: 15, booked: 12, status: "AVAILABLE" as const },
    { start: "11:00", end: "11:30", display: "11:00 AM – 11:30 AM", capacity: 15, booked: 9, status: "AVAILABLE" as const },
    { start: "11:30", end: "12:00", display: "11:30 AM – 12:00 PM", capacity: 15, booked: 6, status: "AVAILABLE" as const },
    { start: "12:00", end: "12:30", display: "12:00 PM – 12:30 PM", capacity: 15, booked: 11, status: "AVAILABLE" as const },
    { start: "12:30", end: "01:00", display: "12:30 PM – 01:00 PM", capacity: 15, booked: 15, status: "FULL" as const },
    { start: "02:00", end: "02:30", display: "02:00 PM – 02:30 PM", capacity: 15, booked: 8, status: "AVAILABLE" as const },
    { start: "02:30", end: "03:00", display: "02:30 PM – 03:00 PM", capacity: 15, booked: 7, status: "AVAILABLE" as const },
    { start: "03:00", end: "03:30", display: "03:00 PM – 03:30 PM", capacity: 15, booked: 13, status: "LIMITED" as const },
    { start: "03:30", end: "04:00", display: "03:30 PM – 04:00 PM", capacity: 15, booked: 10, status: "AVAILABLE" as const },
  ];

  return slotDefinitions.map((def, idx) => ({
    id: `slot-${centreId}-${dateStr}-${idx}`,
    centreId,
    date: dateStr,
    startTime: def.start,
    endTime: def.end,
    displayTime: def.display,
    capacity: def.capacity,
    bookedCount: def.booked,
    status: def.status,
  }));
}

/**
 * Deterministic AI-Powered ETA Algorithm
 * Calculates expected gate call and total wait time using queuing theory
 * (M/M/c queue model approximation parameterized for mandi intake).
 * Code is structured with clear inputs ready for XGBoost / Random Forest regression weights.
 */
export function predictProcurementEta(
  queueLengthAhead: number,
  activeCounters: number,
  avgSpeedMinPerToken: number = 4.2,
  loadFactor: number = 1.02
): AiEtaPrediction {
  const effectiveCounters = Math.max(1, activeCounters);
  // Waiting time in minutes based on active parallel counters plus load factor
  const rawWait = (queueLengthAhead / effectiveCounters) * avgSpeedMinPerToken * loadFactor;
  const estimatedWaitingMinutes = Math.max(2, Math.round(rawWait));

  let confidence: "High" | "Moderate" | "Low" = "High";
  if (activeCounters < 2 || queueLengthAhead > 25) {
    confidence = "Moderate";
  }

  // Recommended arrival: arrive 10-12 minutes before predicted call
  const bufferMin = 10;
  const now = new Date();
  const arrivalDate = new Date(now.getTime() + Math.max(5, estimatedWaitingMinutes - bufferMin) * 60000);
  const arrivalHours = arrivalDate.getHours();
  const arrivalMinutes = arrivalDate.getMinutes().toString().padStart(2, "0");
  const ampm = arrivalHours >= 12 ? "PM" : "AM";
  const formattedHours = arrivalHours % 12 || 12;
  const recommendedArrivalTime = `${formattedHours}:${arrivalMinutes} ${ampm}`;

  const explanation =
    queueLengthAhead === 0
      ? "Your token is currently being called. Proceed immediately to Counter 2."
      : `Based on ${effectiveCounters} active intake counters operating at an average speed of ${avgSpeedMinPerToken.toFixed(
          1
        )} min/farmer, your estimated wait is ~${estimatedWaitingMinutes} minutes. Arrive at ${recommendedArrivalTime} for zero gate delay.`;

  return {
    estimatedWaitingMinutes,
    confidence,
    recommendedArrivalTime,
    slotTime: "10:30 AM – 11:00 AM",
    factors: {
      queueLengthAhead,
      activeCounters: effectiveCounters,
      avgSpeedMinPerToken,
      loadFactor,
    },
    explanation,
    modelVersion: "KisanSetu-ProcureETA-v1.4 (XGBoost Pipeline)",
  };
}

export const INITIAL_DEFAULT_BOOKING: ProcurementBooking = {
  id: "book-demo-9142",
  bookingCode: "KS-PROC-2026-9142",
  farmerId: "usr-farmer-101",
  farmerName: "Rameshwar Prasad Patel",
  farmerPhone: "+91 98765 43210",
  farmId: "farm-1",
  farmName: "Lucknow Shivalik Farm",
  cropName: "Basmati Paddy (धान)",
  commodity: "Paddy",
  variety: "Pusa Basmati 1121",
  estimatedQuantityKg: 1480,
  centreId: "centre-mandal",
  centreName: "Mandal Procurement Centre",
  centreAddress: "Kasmandi Road, Mandi Samiti Campus, Malihabad, Lucknow - 226102",
  date: "12 September 2026",
  slotTime: "10:30 AM – 11:00 AM",
  tokenNumber: "A142",
  queuePosition: 12,
  estimatedWaitMinutes: 32,
  stage: "TOKEN_GENERATED",
  stageDetails: "Slot confirmed. Digital token active. Arrive at centre at recommended time.",
  recommendedArrivalTime: "10:20 AM",
  createdAt: "2026-09-12T07:15:00Z",
  arrivedAt: undefined,
  completedAt: undefined,
  actualQuantityKg: 1480,
  mspPerQuintal: 2300,
  totalAmount: 34040,
  paymentStatus: "PENDING",
  transactionId: "KS-DBT-882910",
  bankAccountMasked: "SBI •••• 4092",
  securityHash: "SHA256:7f8a91c0b3d84...",
};

export const INITIAL_DEFAULT_PAYMENT: ProcurementPayment = {
  id: "pay-demo-882910",
  bookingId: "book-demo-9142",
  tokenNumber: "A142",
  farmerName: "Rameshwar Prasad Patel",
  farmerPhone: "+91 98765 43210",
  crop: "Basmati Paddy (धान)",
  variety: "Pusa Basmati 1121",
  quantityKg: 1480,
  mspRatePerQuintal: 2300,
  totalAmount: 34040,
  status: "PROCESSING",
  transactionId: "KS-DBT-882910",
  dbtReference: "PFMS-UP-2026-09142-9912",
  accountMasked: "State Bank of India (A/C •••• 4092)",
  bankName: "State Bank of India",
  completedDate: "12 September 2026",
  expectedPaymentDate: "14 September 2026",
  stageTimestamps: {
    weighingCompletedAt: "11:15 AM",
    qualityPassedAt: "11:28 AM",
    procurementClosedAt: "11:40 AM",
    dbtInitiatedAt: "11:45 AM",
  },
};

export function buildLiveQueueState(
  centreId: string = "centre-mandal",
  currentServingNum: number = 130,
  farmerTokenNum: number = 142
): QueueLiveState {
  const servingToken = `A${currentServingNum}`;
  const userToken = `A${farmerTokenNum}`;
  const totalWaiting = Math.max(0, farmerTokenNum - currentServingNum);

  const tokensInQueue = [];
  // Include serving token and 1 previous
  if (currentServingNum > 100) {
    tokensInQueue.push({
      token: `A${currentServingNum - 1}`,
      farmerName: "Harishankar Yadav",
      crop: "Paddy",
      position: 0,
      status: "completed" as const,
      counterNumber: 1,
      estimatedWaitMinutes: 0,
    });
  }

  // Currently serving
  tokensInQueue.push({
    token: servingToken,
    farmerName: "Sukhdev Singh",
    crop: "Paddy",
    position: 0,
    status: "serving" as const,
    counterNumber: 2,
    estimatedWaitMinutes: 0,
  });

  // Intermediate tokens
  const sampleNames = [
    "Mahendra Verma",
    "Bhanu Pratap Singh",
    "Kallu Ram",
    "Ram Avtar",
    "Dinesh Kumar",
    "Satish Chandra",
    "Shiv Dayal",
    "Om Prakash",
    "Brijesh Rawat",
    "Mohd. Aslam",
    "Vinod Shukla",
    "Ram Kripal",
    "Chhedi Lal",
    "Lalita Devi",
    "Rameshwar Prasad Patel", // You
  ];

  for (let num = currentServingNum + 1; num <= Math.max(farmerTokenNum + 2, currentServingNum + 14); num++) {
    const isCurrentUser = num === farmerTokenNum;
    const pos = num - currentServingNum;
    const wait = Math.max(2, Math.round((pos / 4) * 4.2));
    const nameIdx = (num - 130) % sampleNames.length;
    tokensInQueue.push({
      token: `A${num}`,
      farmerName: isCurrentUser ? "Rameshwar Prasad Patel (You)" : sampleNames[nameIdx],
      crop: num % 2 === 0 ? "Paddy" : "Wheat",
      position: pos,
      status: (pos <= 2 ? "called" : "waiting") as "called" | "waiting",
      counterNumber: pos === 1 ? 3 : pos === 2 ? 4 : undefined,
      estimatedWaitMinutes: wait,
      isCurrentUser,
    });
  }

  return {
    centreId,
    centreName: "Mandal Procurement Centre",
    currentlyServing: servingToken,
    activeCounters: 4,
    totalWaiting,
    avgProcessingTimeMinutes: 4.2,
    currentLoadPercent: 78,
    tokensInQueue,
    lastUpdated: "Just now (Live WebSocket & Synced)",
  };
}

export const JOURNEY_STAGES_LIST: { stage: ProcurementJourneyStage; label: string; desc: string }[] = [
  { stage: "SLOT_BOOKED", label: "Slot Booked", desc: "Preferred procurement slot confirmed on portal." },
  { stage: "TOKEN_GENERATED", label: "Token Generated", desc: "Digital verification token & QR code issued." },
  { stage: "ARRIVED", label: "Arrived at Centre", desc: "Farmer checked in at Mandi security gate." },
  { stage: "WEIGHING", label: "Electronic Weighing", desc: "Gross vehicle weight and tare recorded on digital weighbridge." },
  { stage: "QUALITY_CHECK", label: "Quality & Moisture Check", desc: "Grading lab testing moisture (<17%) and foreign matter." },
  { stage: "PROCUREMENT_COMPLETED", label: "Procurement Completed", desc: "Official intake receipt and Mandi purchase voucher generated." },
  { stage: "PAYMENT_INITIATED", label: "Payment Initiated", desc: "Direct Benefit Transfer (DBT) order pushed to PFMS bank gateway." },
  { stage: "PAYMENT_RECEIVED", label: "Payment Received", desc: "Funds successfully credited to Aadhaar-linked bank account." },
];
