export type UserRole = "farmer" | "expert" | "admin";

export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: UserRole;
  avatar?: string;
  language: string;
  voiceEnabled: boolean;
  state?: string;
  district?: string;
}

export interface Farm {
  id: string;
  name: string;
  location: string;
  district: string;
  state: string;
  pinCode: string;
  acres: number;
  landType: "irrigated" | "rainfed" | "wetland" | "dryland";
  irrigation: "drip" | "sprinkler" | "canal" | "borewell" | "rainfed";
  soilType: "alluvial" | "black" | "red" | "laterite" | "clayey" | "sandy_loam";
  coordinates: {
    lat: number;
    lng: number;
  };
  healthScore: number;
  activeCropsCount: number;
  documentsCount: number;
  createdAt: string;
}

export type CropStage =
  | "Seed"
  | "Germination"
  | "Vegetative"
  | "Flowering"
  | "Fruiting"
  | "Maturity"
  | "Harvest";

export interface StageGuidance {
  stage: CropStage;
  irrigationNotice: string;
  fertilizerTip: string;
  pestVigilance: string;
  diseaseMonitoring: string;
}

export interface Crop {
  id: string;
  farmId: string;
  farmName: string;
  name: string;
  variety: string;
  areaAcres: number;
  sowingDate: string;
  expectedHarvest: string;
  season: "Kharif" | "Rabi" | "Zaid";
  currentStage: CropStage;
  health: "excellent" | "good" | "warning" | "critical";
  pestRisk: "low" | "moderate" | "high";
  diseaseRisk: "low" | "moderate" | "high";
  weatherCondition: string;
  irrigationStatus: string;
  notes?: string;
}

export interface DiseasePrediction {
  id: string;
  cropName: string;
  diseaseName: string;
  confidencePercent: number;
  severity: "Mild" | "Moderate" | "Severe";
  symptoms: string[];
  recommendations: string[];
  prevention: string[];
  modelVersion: string;
  timestamp: string;
  reviewedByExpert?: boolean;
}

export interface WeatherData {
  currentTemp: number;
  feelsLike: number;
  humidity: number;
  windSpeedKmH: number;
  rainProbabilityPercent: number;
  rainfallMm: number;
  uvIndex: number;
  condition: "Sunny" | "Partly Cloudy" | "Cloudy" | "Light Rain" | "Thunderstorm";
  hourlyForecast: {
    time: string;
    temp: number;
    pop: number;
    icon: string;
  }[];
  dailyForecast: {
    day: string;
    date: string;
    maxTemp: number;
    minTemp: number;
    condition: string;
    rainProb: number;
  }[];
  farmingRecommendation: string;
}

export interface MarketPrice {
  id: string;
  commodity: string;
  variety: string;
  mandi: string;
  district: string;
  state: string;
  modalPrice: number;
  minPrice: number;
  maxPrice: number;
  priceChangePercent: number;
  date: string;
  unit: string;
  historicalTrend: { date: string; price: number }[];
}

export interface PriceAlert {
  id: string;
  commodity: string;
  targetPrice: number;
  condition: "above" | "below";
  active: boolean;
  createdAt: string;
}

export interface GovernmentScheme {
  id: string;
  title: string;
  ministry: string;
  category: "Financial Support" | "Insurance" | "Infrastructure" | "Input Subsidy" | "Irrigation";
  summary: string;
  benefits: string;
  eligibility: string[];
  requiredDocuments: string[];
  deadline: string;
  state: string;
  officialSourceUrl: string;
  isSaved?: boolean;
}

export interface SoilRecord {
  id: string;
  farmId: string;
  date: string;
  nitrogenKgHa: number;
  phosphorusKgHa: number;
  potassiumKgHa: number;
  ph: number;
  organicCarbonPercent: number;
  moisturePercent: number;
  healthScore: number;
  recommendations: string[];
  reportFile?: string;
}

export interface JournalEntry {
  id: string;
  farmId: string;
  cropId?: string;
  cropName?: string;
  date: string;
  type:
    | "sowing"
    | "irrigation"
    | "fertilizer"
    | "pesticide"
    | "pest"
    | "disease"
    | "weather"
    | "harvest"
    | "expense"
    | "other";
  title: string;
  description: string;
  quantity?: string;
  cost?: number;
  attachments?: string[];
  notes?: string;
}

export interface EconomicsRecord {
  id: string;
  farmId: string;
  type: "expense" | "revenue";
  category:
    | "Seeds"
    | "Fertilizer"
    | "Pesticide"
    | "Labor"
    | "Irrigation"
    | "Machinery"
    | "Transport"
    | "Crop Sale"
    | "Other";
  cropName: string;
  amount: number;
  date: string;
  buyerOrVendor?: string;
  notes?: string;
}

export interface AlertNotification {
  id: string;
  category:
    | "weather"
    | "crop"
    | "disease"
    | "pest"
    | "market"
    | "government"
    | "farm"
    | "system";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: "urgent" | "warning" | "info";
  actionUrl?: string;
}

export interface ExpertProfile {
  id: string;
  name: string;
  qualification: string;
  specialization: string;
  experienceYears: number;
  rating: number;
  reviewCount: number;
  languages: string[];
  verified: boolean;
  location: string;
  avatarUrl: string;
  availableSlots: string[];
}

export interface Consultation {
  id: string;
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  farmName: string;
  expertId: string;
  expertName: string;
  cropName: string;
  status: "requested" | "confirmed" | "in_progress" | "completed" | "cancelled";
  scheduledSlot: string;
  issueDescription: string;
  photos: string[];
  expertAssessment?: string;
  recommendations?: string;
  createdAt: string;
}

export interface AIMessage {
  id: string;
  sender: "user" | "assistant";
  content: string;
  timestamp: string;
  attachments?: string[];
  suggestedPrompts?: string[];
}

export interface MLModelMetric {
  id: string;
  name: string;
  task: string;
  version: string;
  status: "active" | "training" | "staging" | "deprecated";
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  avgLatencyMs: number;
  lastUpdated: string;
}
