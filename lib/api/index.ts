import {
  Farm,
  Crop,
  WeatherData,
  MarketPrice,
  PriceAlert,
  GovernmentScheme,
  SoilRecord,
  JournalEntry,
  EconomicsRecord,
  ExpertProfile,
  Consultation,
  DiseasePrediction,
  MLModelMetric,
  AlertNotification,
} from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.kisansetu.in/v1";

// Helper for real backend fetch when connected
async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers || {}),
      },
    });
    if (!res.ok) {
      throw new Error(`API error: ${res.status} ${res.statusText}`);
    }
    return await res.json();
  } catch (error) {
    // When backend server is not reachable, fallback gracefully to client state
    console.warn(`[Kisan Setu API] Backend unreachable at ${endpoint}, utilizing typed service cache.`);
    throw error;
  }
}

/* =========================================================================
   CROP SERVICE
   ========================================================================= */
export const INITIAL_CROPS: Crop[] = [
  {
    id: "crop-1",
    farmId: "farm-1",
    farmName: "Lucknow Shivalik Farm",
    name: "Wheat (गेहूं)",
    variety: "HD-2967 (Pusa Sugandh)",
    areaAcres: 2.5,
    sowingDate: "2025-11-10",
    expectedHarvest: "2026-03-25",
    season: "Rabi",
    currentStage: "Flowering",
    health: "good",
    pestRisk: "low",
    diseaseRisk: "low",
    weatherCondition: "Favorable dry air, mild winter mornings",
    irrigationStatus: "Irrigated 3 days ago. Next due in 5 days.",
    notes: "Top dressing with Urea completed on 45th day.",
  },
  {
    id: "crop-2",
    farmId: "farm-1",
    farmName: "Lucknow Shivalik Farm",
    name: "Mustard (सरसों)",
    variety: "Pusa Bold",
    areaAcres: 2.0,
    sowingDate: "2025-10-25",
    expectedHarvest: "2026-02-28",
    season: "Rabi",
    currentStage: "Fruiting",
    health: "excellent",
    pestRisk: "moderate",
    diseaseRisk: "low",
    weatherCondition: "Sunny, optimal pod filling temperatures",
    irrigationStatus: "Adequate moisture level",
    notes: "Vigilance needed for Mustard aphid on overcast days.",
  },
  {
    id: "crop-3",
    farmId: "farm-2",
    farmName: "Barabanki River Basin Farm",
    name: "Basmati Paddy (धान)",
    variety: "Pusa Basmati 1121",
    areaAcres: 2.2,
    sowingDate: "2025-07-05",
    expectedHarvest: "2025-11-15",
    season: "Kharif",
    currentStage: "Harvest",
    health: "excellent",
    pestRisk: "low",
    diseaseRisk: "low",
    weatherCondition: "Post-monsoon dry spell",
    irrigationStatus: "Field drainage completed before harvest",
    notes: "Yield exceeded expectation by 8 quintals.",
  },
];

export const cropApi = {
  async getCrops(farmId?: string): Promise<Crop[]> {
    let list = INITIAL_CROPS;
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("kisan_crops");
      if (saved) {
        try {
          list = JSON.parse(saved);
        } catch (e) {}
      }
    }
    if (farmId) {
      const filtered = list.filter((c) => c.farmId === farmId);
      return filtered.length > 0 ? filtered : list;
    }
    return list;
  },

  async addCrop(crop: Omit<Crop, "id">): Promise<Crop> {
    const newCrop: Crop = { ...crop, id: `crop-${Date.now()}` };
    const current = await this.getCrops();
    const updated = [newCrop, ...current];
    if (typeof window !== "undefined") {
      localStorage.setItem("kisan_crops", JSON.stringify(updated));
    }
    return newCrop;
  },

  async updateCropStage(id: string, stage: Crop["currentStage"]): Promise<Crop> {
    const current = await this.getCrops();
    const updated = current.map((c) => (c.id === id ? { ...c, currentStage: stage } : c));
    if (typeof window !== "undefined") {
      localStorage.setItem("kisan_crops", JSON.stringify(updated));
    }
    return updated.find((c) => c.id === id)!;
  },

  async deleteCrop(id: string): Promise<void> {
    const current = await this.getCrops();
    const filtered = current.filter((c) => c.id !== id);
    if (typeof window !== "undefined") {
      localStorage.setItem("kisan_crops", JSON.stringify(filtered));
    }
  },
};

/* =========================================================================
   CROP DOCTOR ML SERVICE CONTRACT
   ========================================================================= */
export const cropDoctorApi = {
  async diagnoseImage(fileOrBase64: string): Promise<DiseasePrediction> {
    // Contract adhering simulation delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Validated advisory ML response format
    return {
      id: `diag-${Date.now()}`,
      cropName: "Wheat / सरसों (Field Specimen)",
      diseaseName: "Early Stage Yellow Rust (Puccinia striiformis)",
      confidencePercent: 91.4,
      severity: "Moderate",
      symptoms: [
        "Yellow-orange powdery pustules formed in linear stripes on leaf surface",
        "Chlorotic streaks along leaf veins",
        "Slight leaf curling near apex",
      ],
      recommendations: [
        "Spray Propiconazole 25% EC @ 1 ml/litre of water if weather remains cloudy",
        "Avoid excess nitrogenous fertilizer application during high humidity spells",
        "Inspect surrounding 5-meter perimeter to detect isolated infection patches",
      ],
      prevention: [
        "Use rust-tolerant varieties like DBW 187, DBW 222 in future sowing seasons",
        "Practice seed treatment with Carboxin + Thiram @ 2g/kg seed before sowing",
        "Maintain proper crop row spacing to ensure adequate air circulation",
      ],
      modelVersion: "AgriVision-ResNet50-v2.4.1",
      timestamp: new Date().toISOString(),
      reviewedByExpert: false,
    };
  },
};

/* =========================================================================
   WEATHER INTELLIGENCE SERVICE
   ========================================================================= */
export const weatherApi = {
  async getWeather(location: string = "Lucknow, Uttar Pradesh"): Promise<WeatherData> {
    return {
      currentTemp: 24,
      feelsLike: 23,
      humidity: 58,
      windSpeedKmH: 11,
      rainProbabilityPercent: 12,
      rainfallMm: 0,
      uvIndex: 5,
      condition: "Sunny",
      hourlyForecast: [
        { time: "06:00", temp: 16, pop: 5, icon: "sun" },
        { time: "09:00", temp: 20, pop: 8, icon: "sun" },
        { time: "12:00", temp: 25, pop: 10, icon: "sun" },
        { time: "15:00", temp: 26, pop: 12, icon: "sun" },
        { time: "18:00", temp: 22, pop: 15, icon: "cloud" },
        { time: "21:00", temp: 19, pop: 10, icon: "cloud" },
      ],
      dailyForecast: [
        { day: "Today", date: "11 Sep", maxTemp: 27, minTemp: 16, condition: "Sunny", rainProb: 10 },
        { day: "Tomorrow", date: "12 Sep", maxTemp: 28, minTemp: 17, condition: "Partly Cloudy", rainProb: 15 },
        { day: "Wed", date: "13 Sep", maxTemp: 26, minTemp: 18, condition: "Light Rain", rainProb: 65 },
        { day: "Thu", date: "14 Sep", maxTemp: 25, minTemp: 17, condition: "Overcast", rainProb: 40 },
        { day: "Fri", date: "15 Sep", maxTemp: 27, minTemp: 16, condition: "Sunny", rainProb: 10 },
        { day: "Sat", date: "16 Sep", maxTemp: 28, minTemp: 17, condition: "Sunny", rainProb: 5 },
        { day: "Sun", date: "17 Sep", maxTemp: 29, minTemp: 18, condition: "Clear", rainProb: 5 },
      ],
      farmingRecommendation:
        "Favorable dry weather for next 48 hours. Ideal window for weed management and foliar nutrient spraying. Postpone heavy irrigation as light showers are forecast for Wednesday.",
    };
  },
};

/* =========================================================================
   MARKET & MANDI PRICES SERVICE
   ========================================================================= */
export const INITIAL_MARKET_PRICES: MarketPrice[] = [
  {
    id: "mkt-1",
    commodity: "Wheat (गेहूं)",
    variety: "Dara / Lokwan",
    mandi: "Malihabad APMC",
    district: "Lucknow",
    state: "Uttar Pradesh",
    modalPrice: 2420,
    minPrice: 2360,
    maxPrice: 2480,
    priceChangePercent: 1.8,
    date: "11 Sep 2026",
    unit: "₹/Quintal",
    historicalTrend: [
      { date: "05 Sep", price: 2340 },
      { date: "06 Sep", price: 2360 },
      { date: "07 Sep", price: 2375 },
      { date: "08 Sep", price: 2390 },
      { date: "09 Sep", price: 2400 },
      { date: "10 Sep", price: 2410 },
      { date: "11 Sep", price: 2420 },
    ],
  },
  {
    id: "mkt-2",
    commodity: "Mustard (सरसों)",
    variety: "Black Mustard",
    mandi: "Sitapur Krishi Mandi",
    district: "Sitapur",
    state: "Uttar Pradesh",
    modalPrice: 5650,
    minPrice: 5450,
    maxPrice: 5800,
    priceChangePercent: -0.8,
    date: "11 Sep 2026",
    unit: "₹/Quintal",
    historicalTrend: [
      { date: "05 Sep", price: 5720 },
      { date: "06 Sep", price: 5700 },
      { date: "07 Sep", price: 5680 },
      { date: "08 Sep", price: 5690 },
      { date: "09 Sep", price: 5670 },
      { date: "10 Sep", price: 5660 },
      { date: "11 Sep", price: 5650 },
    ],
  },
  {
    id: "mkt-3",
    commodity: "Basmati Paddy (धान)",
    variety: "1121 Pusa",
    mandi: "Karnal Grain Market",
    district: "Karnal",
    state: "Haryana",
    modalPrice: 4280,
    minPrice: 4100,
    maxPrice: 4450,
    priceChangePercent: 3.2,
    date: "11 Sep 2026",
    unit: "₹/Quintal",
    historicalTrend: [
      { date: "05 Sep", price: 4050 },
      { date: "06 Sep", price: 4100 },
      { date: "07 Sep", price: 4150 },
      { date: "08 Sep", price: 4200 },
      { date: "09 Sep", price: 4220 },
      { date: "10 Sep", price: 4250 },
      { date: "11 Sep", price: 4280 },
    ],
  },
  {
    id: "mkt-4",
    commodity: "Potato (आलू)",
    variety: "Kufri Jyoti",
    mandi: "Farrukhabad Mandi",
    district: "Farrukhabad",
    state: "Uttar Pradesh",
    modalPrice: 1150,
    minPrice: 980,
    maxPrice: 1250,
    priceChangePercent: 4.5,
    date: "11 Sep 2026",
    unit: "₹/Quintal",
    historicalTrend: [
      { date: "05 Sep", price: 1020 },
      { date: "06 Sep", price: 1040 },
      { date: "07 Sep", price: 1060 },
      { date: "08 Sep", price: 1080 },
      { date: "09 Sep", price: 1100 },
      { date: "10 Sep", price: 1120 },
      { date: "11 Sep", price: 1150 },
    ],
  },
];

export const marketApi = {
  async getMarketPrices(): Promise<MarketPrice[]> {
    return INITIAL_MARKET_PRICES;
  },

  async getPriceAlerts(): Promise<PriceAlert[]> {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("kisan_price_alerts");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {}
      }
    }
    return [
      {
        id: "alt-1",
        commodity: "Wheat (गेहूं)",
        targetPrice: 2450,
        condition: "above",
        active: true,
        createdAt: "2026-09-08",
      },
      {
        id: "alt-2",
        commodity: "Mustard (सरसों)",
        targetPrice: 5800,
        condition: "above",
        active: true,
        createdAt: "2026-09-05",
      },
    ];
  },

  async addPriceAlert(alert: Omit<PriceAlert, "id" | "createdAt" | "active">): Promise<PriceAlert> {
    const newAlert: PriceAlert = {
      ...alert,
      id: `alt-${Date.now()}`,
      active: true,
      createdAt: new Date().toISOString().split("T")[0],
    };
    const current = await this.getPriceAlerts();
    const updated = [newAlert, ...current];
    if (typeof window !== "undefined") {
      localStorage.setItem("kisan_price_alerts", JSON.stringify(updated));
    }
    return newAlert;
  },

  async togglePriceAlert(id: string): Promise<void> {
    const current = await this.getPriceAlerts();
    const updated = current.map((a) => (a.id === id ? { ...a, active: !a.active } : a));
    if (typeof window !== "undefined") {
      localStorage.setItem("kisan_price_alerts", JSON.stringify(updated));
    }
  },

  async deletePriceAlert(id: string): Promise<void> {
    const current = await this.getPriceAlerts();
    const updated = current.filter((a) => a.id !== id);
    if (typeof window !== "undefined") {
      localStorage.setItem("kisan_price_alerts", JSON.stringify(updated));
    }
  },
};

/* =========================================================================
   GOVERNMENT SCHEMES SERVICE
   ========================================================================= */
export const GOVERNMENT_SCHEMES: GovernmentScheme[] = [
  {
    id: "scheme-pmkisan",
    title: "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    category: "Financial Support",
    summary:
      "Direct income support of ₹6,000 per year in three equal installments of ₹2,000 directly transferred to farmer Aadhaar-linked bank accounts.",
    benefits: "₹6,000 annually paid in 3 installments every 4 months.",
    eligibility: [
      "All landholding farmer families with cultivable landholding in their names",
      "Valid Aadhaar card linked with active bank account",
      "Mandatory e-KYC completed on PM-KISAN portal",
      "Excludes institutional landholders and constitutional post holders",
    ],
    requiredDocuments: [
      "Aadhaar Card",
      "Land Ownership Document (Khatauni / Jamabandi)",
      "Aadhaar-seeded Bank Passbook",
      "Active Mobile Number",
    ],
    deadline: "Continuous Open Enrollment",
    state: "National / All States",
    officialSourceUrl: "https://pmkisan.gov.in",
    isSaved: true,
  },
  {
    id: "scheme-pmfby",
    title: "PMFBY (Pradhan Mantri Fasal Bima Yojana)",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    category: "Insurance",
    summary:
      "Comprehensive crop insurance covering non-preventable natural risks from pre-sowing to post-harvest at ultra-low premium rates for farmers (1.5% - 2%).",
    benefits: "Full sum insured payout against flood, drought, pest outbreaks, and localized hail damage.",
    eligibility: [
      "All farmers including sharecroppers and tenant farmers growing notified crops in notified areas",
      "Enrollment within cut-off dates announced for Kharif/Rabi seasons",
    ],
    requiredDocuments: [
      "Land Possession Certificate (LPC) or Sowing Certificate",
      "Identity Proof (Aadhaar / Voter ID)",
      "Bank Account Details",
    ],
    deadline: "31 October (Rabi Season Cutoff)",
    state: "National / All States",
    officialSourceUrl: "https://pmfby.gov.in",
    isSaved: false,
  },
  {
    id: "scheme-pmksy",
    title: "PMKSY - Per Drop More Crop (Micro Irrigation)",
    ministry: "Department of Agriculture & Farmers Welfare",
    category: "Irrigation",
    summary:
      "Capital subsidy of up to 55% for small/marginal farmers and 45% for other farmers to install Drip and Sprinkler irrigation systems.",
    benefits: "Up to 55% direct subsidy on equipment and installation costs.",
    eligibility: [
      "Farmers having assured irrigation source and cultivable land",
      "Priority given to water-stressed blocks and dryland zones",
    ],
    requiredDocuments: [
      "Land Records (Khasra/Khatauni)",
      "Source of Water Certificate (Borewell / Canal NOC)",
      "Soil & Water Test Report",
    ],
    deadline: "State-wise annual budget window",
    state: "All States",
    officialSourceUrl: "https://pmksy.gov.in",
    isSaved: false,
  },
  {
    id: "scheme-soilcard",
    title: "Soil Health Card Scheme (मृदा स्वास्थ्य कार्ड)",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    category: "Input Subsidy",
    summary:
      "Free soil testing every 2 years providing crop-wise dosage recommendations of macro (N, P, K) and micronutrients to optimize fertilizer spend.",
    benefits: "Free 12-parameter soil test and tailored fertilizer dosage advice.",
    eligibility: ["All cultivating farmers with operational land holdings."],
    requiredDocuments: ["Farmer ID / Aadhaar", "Field Plot Coordinates"],
    deadline: "Ongoing at Block Krishi Vigyan Kendras",
    state: "All States",
    officialSourceUrl: "https://soilhealth.dac.gov.in",
    isSaved: false,
  },
];

export const schemeApi = {
  async getSchemes(): Promise<GovernmentScheme[]> {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("kisan_schemes");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {}
      }
    }
    return GOVERNMENT_SCHEMES;
  },

  async toggleSaveScheme(id: string): Promise<boolean> {
    const current = await this.getSchemes();
    const updated = current.map((s) => (s.id === id ? { ...s, isSaved: !s.isSaved } : s));
    if (typeof window !== "undefined") {
      localStorage.setItem("kisan_schemes", JSON.stringify(updated));
    }
    return updated.find((s) => s.id === id)?.isSaved || false;
  },
};

/* =========================================================================
   SOIL HEALTH SERVICE
   ========================================================================= */
export const soilApi = {
  async getSoilRecord(farmId: string): Promise<SoilRecord> {
    return {
      id: `soil-${farmId}`,
      farmId,
      date: "15 Aug 2026",
      nitrogenKgHa: 265, // Medium range (280 is target)
      phosphorusKgHa: 22, // Medium range (25 is target)
      potassiumKgHa: 290, // High/Good
      ph: 6.8, // Optimal near-neutral
      organicCarbonPercent: 0.62, // Medium
      moisturePercent: 42, // Adequate
      healthScore: 84,
      recommendations: [
        "Incorporate 2-3 tonnes/acre of Farmyard Manure (FYM) to boost organic carbon above 0.75%",
        "Nitrogen level is slightly deficient; supplement with Neem-Coated Urea in split doses",
        "Phosphorus and Potassium balance is well maintained for rabi cereal crops",
        "Soil pH of 6.8 is ideal for optimal micronutrient uptake",
      ],
      reportFile: "SHC-UP-LKO-2026-088.pdf",
    };
  },
};

/* =========================================================================
   FARM JOURNAL & OPERATIONS SERVICE
   ========================================================================= */
export const INITIAL_JOURNAL: JournalEntry[] = [
  {
    id: "jnl-1",
    farmId: "farm-1",
    cropName: "Wheat",
    date: "08 Sep 2026",
    type: "irrigation",
    title: "First Crown Root Irrigation",
    description: "Applied light irrigation across 2.5 acres via drip emitters. Soil moisture reached 45%.",
    quantity: "4 hours run time",
    cost: 450,
  },
  {
    id: "jnl-2",
    farmId: "farm-1",
    cropName: "Mustard",
    date: "04 Sep 2026",
    type: "pesticide",
    title: "Prophylactic Neem Oil Foliar Spray",
    description: "Applied cold-pressed neem oil @ 3ml/litre as preventive spray against early aphids.",
    quantity: "500 ml",
    cost: 320,
  },
  {
    id: "jnl-3",
    farmId: "farm-1",
    cropName: "Wheat",
    date: "28 Aug 2026",
    type: "fertilizer",
    title: "Basal DAP & Zinc Application",
    description: "Applied 50kg DAP + 5kg Zinc Sulphate at seed furrow level during sowing.",
    quantity: "1 Bag DAP",
    cost: 1350,
  },
];

export const journalApi = {
  async getEntries(): Promise<JournalEntry[]> {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("kisan_journal");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {}
      }
    }
    return INITIAL_JOURNAL;
  },

  async addEntry(entry: Omit<JournalEntry, "id">): Promise<JournalEntry> {
    const newEntry: JournalEntry = { ...entry, id: `jnl-${Date.now()}` };
    const current = await this.getEntries();
    const updated = [newEntry, ...current];
    if (typeof window !== "undefined") {
      localStorage.setItem("kisan_journal", JSON.stringify(updated));
    }
    return newEntry;
  },
};

/* =========================================================================
   FARM ECONOMICS SERVICE
   ========================================================================= */
export const INITIAL_ECONOMICS: EconomicsRecord[] = [
  {
    id: "eco-1",
    farmId: "farm-1",
    type: "expense",
    category: "Seeds",
    cropName: "Wheat",
    amount: 3200,
    date: "2025-11-08",
    buyerOrVendor: "National Seeds Corp",
  },
  {
    id: "eco-2",
    farmId: "farm-1",
    type: "expense",
    category: "Fertilizer",
    cropName: "Wheat",
    amount: 5400,
    date: "2025-11-12",
    buyerOrVendor: "IFFCO Cooperative",
  },
  {
    id: "eco-3",
    farmId: "farm-1",
    type: "expense",
    category: "Labor",
    cropName: "Wheat",
    amount: 6000,
    date: "2025-11-15",
    buyerOrVendor: "Local Field Crew",
  },
  {
    id: "eco-4",
    farmId: "farm-1",
    type: "expense",
    category: "Machinery",
    cropName: "Wheat",
    amount: 4500,
    date: "2025-11-09",
    buyerOrVendor: "Tractor Rotavator Rent",
  },
  {
    id: "eco-5",
    farmId: "farm-1",
    type: "revenue",
    category: "Crop Sale",
    cropName: "Paddy (Kharif)",
    amount: 72800,
    date: "2025-11-20",
    buyerOrVendor: "Malihabad APMC Trader",
  },
  {
    id: "eco-6",
    farmId: "farm-1",
    type: "revenue",
    category: "Crop Sale",
    cropName: "Mustard Seed",
    amount: 38400,
    date: "2026-03-05",
    buyerOrVendor: "Oil Mill Aggregator",
  },
];

export const economicsApi = {
  async getRecords(): Promise<EconomicsRecord[]> {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("kisan_economics");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {}
      }
    }
    return INITIAL_ECONOMICS;
  },

  async addRecord(rec: Omit<EconomicsRecord, "id">): Promise<EconomicsRecord> {
    const newRec: EconomicsRecord = { ...rec, id: `eco-${Date.now()}` };
    const current = await this.getRecords();
    const updated = [newRec, ...current];
    if (typeof window !== "undefined") {
      localStorage.setItem("kisan_economics", JSON.stringify(updated));
    }
    return newRec;
  },
};

/* =========================================================================
   AGRONOMIST EXPERT CONSULTATIONS SERVICE
   ========================================================================= */
export const EXPERTS_LIST: ExpertProfile[] = [
  {
    id: "exp-1",
    name: "Dr. Ananya Swaminathan",
    qualification: "Ph.D. in Plant Pathology (IARI New Delhi)",
    specialization: "Cereal Crop Diseases & Integrated Pest Management",
    experienceYears: 14,
    rating: 4.9,
    reviewCount: 382,
    languages: ["Hindi", "English", "Tamil"],
    verified: true,
    location: "ICAR-IARI, New Delhi",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    availableSlots: ["Today 4:00 PM", "Tomorrow 10:30 AM", "Tomorrow 3:00 PM"],
  },
  {
    id: "exp-2",
    name: "Prof. H. R. Chandrappa",
    qualification: "M.Sc. Agriculture (UAS Bangalore)",
    specialization: "Soil Fertility, Drip Fertigation & Organic Inputs",
    experienceYears: 22,
    rating: 4.8,
    reviewCount: 512,
    languages: ["Kannada", "Hindi", "English"],
    verified: true,
    location: "UAS, Dharwad",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    availableSlots: ["Tomorrow 11:00 AM", "Thursday 2:00 PM"],
  },
  {
    id: "exp-3",
    name: "Dr. Balwant Singh Dhillon",
    qualification: "Ph.D. Agronomy (PAU Ludhiana)",
    specialization: "Wheat, Paddy, Mustard High-Yield Practices",
    experienceYears: 18,
    rating: 4.95,
    reviewCount: 640,
    languages: ["Punjabi", "Hindi", "English"],
    verified: true,
    location: "PAU, Ludhiana, Punjab",
    avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
    availableSlots: ["Today 5:30 PM", "Tomorrow 9:00 AM"],
  },
];

export const INITIAL_CONSULTATIONS: Consultation[] = [
  {
    id: "con-101",
    farmerId: "usr-farmer-101",
    farmerName: "Rameshwar Prasad Patel",
    farmerPhone: "+91 98765 43210",
    farmName: "Lucknow Shivalik Farm",
    expertId: "exp-1",
    expertName: "Dr. Ananya Swaminathan",
    cropName: "Wheat (HD-2967)",
    status: "confirmed",
    scheduledSlot: "Tomorrow 10:30 AM",
    issueDescription:
      "Leaf tip chlorosis detected on south ridge. Need recommendation on micronutrient spray vs fungicide.",
    photos: ["https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=300&auto=format&fit=crop&q=80"],
    createdAt: "2026-09-10",
  },
];

export const expertApi = {
  async getExperts(): Promise<ExpertProfile[]> {
    return EXPERTS_LIST;
  },

  async getConsultations(): Promise<Consultation[]> {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("kisan_consultations");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {}
      }
    }
    return INITIAL_CONSULTATIONS;
  },

  async bookConsultation(data: Omit<Consultation, "id" | "createdAt" | "status">): Promise<Consultation> {
    const newCon: Consultation = {
      ...data,
      id: `con-${Date.now()}`,
      status: "requested",
      createdAt: new Date().toISOString().split("T")[0],
    };
    const current = await this.getConsultations();
    const updated = [newCon, ...current];
    if (typeof window !== "undefined") {
      localStorage.setItem("kisan_consultations", JSON.stringify(updated));
    }
    return newCon;
  },

  async updateConsultationStatus(id: string, status: Consultation["status"], assessment?: string): Promise<void> {
    const current = await this.getConsultations();
    const updated = current.map((c) =>
      c.id === id ? { ...c, status, expertAssessment: assessment || c.expertAssessment } : c
    );
    if (typeof window !== "undefined") {
      localStorage.setItem("kisan_consultations", JSON.stringify(updated));
    }
  },
};

/* =========================================================================
   ADMIN TELEMETRY & ML METRICS SERVICE
   ========================================================================= */
export const adminApi = {
  async getMLMetrics(): Promise<MLModelMetric[]> {
    return [
      {
        id: "mdl-1",
        name: "Crop Disease Computer Vision",
        task: "Leaf Pattern Classification",
        version: "AgriVision-ResNet50-v2.4.1",
        status: "active",
        accuracy: 96.4,
        precision: 95.8,
        recall: 96.1,
        f1Score: 95.9,
        avgLatencyMs: 142,
        lastUpdated: "2026-09-01",
      },
      {
        id: "mdl-2",
        name: "Mandi Price Forecasting",
        task: "Time Series Price Prediction",
        version: "MandiProphet-LSTM-v1.8",
        status: "active",
        accuracy: 91.2,
        precision: 89.7,
        recall: 92.4,
        f1Score: 91.0,
        avgLatencyMs: 88,
        lastUpdated: "2026-08-25",
      },
      {
        id: "mdl-3",
        name: "Fertilizer & Irrigation Optimizer",
        task: "Nutrient Requirement Modeling",
        version: "SoilNutrientXGBoost-v3.0",
        status: "active",
        accuracy: 94.7,
        precision: 93.9,
        recall: 95.2,
        f1Score: 94.5,
        avgLatencyMs: 45,
        lastUpdated: "2026-09-05",
      },
    ];
  },
};

/* =========================================================================
   ALERTS SERVICE
   ========================================================================= */
export const INITIAL_ALERTS: AlertNotification[] = [
  {
    id: "alt-n1",
    category: "weather",
    title: "Light Rain Expected in 48 Hours",
    message: "IMD predicts 10-15mm rainfall in Lucknow district on Wednesday. Hold irrigation for wheat.",
    timestamp: "2 hours ago",
    read: false,
    priority: "warning",
    actionUrl: "/farmer/weather",
  },
  {
    id: "alt-n2",
    category: "market",
    title: "Wheat Price Exceeded ₹2,420/Q",
    message: "Your price alert threshold was triggered at Malihabad APMC. Current modal rate: ₹2,420.",
    timestamp: "5 hours ago",
    read: false,
    priority: "info",
    actionUrl: "/farmer/market",
  },
  {
    id: "alt-n3",
    category: "pest",
    title: "Mustard Aphid Advisory Alert",
    message: "High humidity conditions favor aphid propagation in Awadh region. Inspect crop underside.",
    timestamp: "1 day ago",
    read: true,
    priority: "urgent",
    actionUrl: "/farmer/crop-doctor",
  },
];

export const alertApi = {
  async getAlerts(): Promise<AlertNotification[]> {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("kisan_alerts");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {}
      }
    }
    return INITIAL_ALERTS;
  },

  async markAsRead(id: string): Promise<void> {
    const current = await this.getAlerts();
    const updated = current.map((a) => (a.id === id ? { ...a, read: true } : a));
    if (typeof window !== "undefined") {
      localStorage.setItem("kisan_alerts", JSON.stringify(updated));
    }
  },

  async markAllRead(): Promise<void> {
    const current = await this.getAlerts();
    const updated = current.map((a) => ({ ...a, read: true }));
    if (typeof window !== "undefined") {
      localStorage.setItem("kisan_alerts", JSON.stringify(updated));
    }
  },
};
