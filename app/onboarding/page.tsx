"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sprout,
  Tractor,
  User,
  Layers,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  MapPin,
  UploadCloud,
  Plus,
  Trash2,
  Search,
  Check,
  ShieldCheck,
  Compass,
  AlertCircle,
  FileText,
  RotateCcw,
} from "lucide-react";
import { GlassCard } from "@/components/glass/GlassCard";
import { GlassButton } from "@/components/glass/GlassButton";
import { GlassBadge } from "@/components/glass/GlassBadge";
import { GlassInput } from "@/components/glass/GlassInput";
import { GlassSelect } from "@/components/glass/GlassSelect";
import { GlassUpload } from "@/components/glass/GlassUpload";
import { useSession } from "@/lib/auth";
import { useTranslation } from "@/lib/i18n";
import { useToast } from "@/lib/toast";
import { SUPPORTED_LANGUAGES } from "@/lib/i18n/languages";
import {
  INDIAN_LOCATIONS,
  getSupportedStates,
  getDistrictsForState,
  getSubDistrictsForDistrict,
  getVillagesForSubDistrict,
} from "@/lib/data/locations";

interface OnboardingCropItem {
  id: string;
  name: string;
  variety: string;
  area: string;
  season: "Rabi" | "Kharif" | "Zaid";
  sowingDate: string;
  expectedHarvest: string;
}

export default function FarmerOnboardingPage() {
  const router = useRouter();
  const { user, updateUser, addFarm, setOnboarded } = useSession();
  const { t, setLanguage } = useTranslation();
  const { showToast } = useToast();

  const [step, setStep] = useState(1); // Steps 1 to 5, and 6 for Summary
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isDraftRestored, setIsDraftRestored] = useState(false);

  // STEP 1: About You
  const [farmerName, setFarmerName] = useState(user?.name || "");
  const [age, setAge] = useState("");
  const [preferredLanguage, setPreferredLanguage] = useState(user?.language || "en");
  const [state, setState] = useState(user?.state || "Uttar Pradesh");
  const [district, setDistrict] = useState(user?.district || "Lucknow");
  const [subDistrict, setSubDistrict] = useState("Malihabad");
  const [village, setVillage] = useState("Kasmandi Kalan");
  const [customVillage, setCustomVillage] = useState("");

  // Dependent location lists
  const availableStates = useMemo(() => getSupportedStates(), []);
  const availableDistricts = useMemo(() => getDistrictsForState(state), [state]);
  const availableSubDistricts = useMemo(
    () => getSubDistrictsForDistrict(state, district),
    [state, district]
  );
  const availableVillages = useMemo(
    () => getVillagesForSubDistrict(state, district, subDistrict),
    [state, district, subDistrict]
  );

  // STEP 2: About Your Farm
  const [farmName, setFarmName] = useState("");
  const [farmSize, setFarmSize] = useState("");
  const [sizeUnit, setSizeUnit] = useState<"Acres" | "Hectares">("Acres");
  const [irrigation, setIrrigation] = useState<
    "drip" | "sprinkler" | "borewell" | "canal" | "rainfed"
  >("drip");
  const [landType, setLandType] = useState<
    "irrigated" | "rainfed" | "wetland" | "dryland"
  >("irrigated");
  const [ownership, setOwnership] = useState("Owned");
  const [useGpsLocation, setUseGpsLocation] = useState(false);

  // STEP 3: Crops (Starts empty, no hardcoded dummy data)
  const [cropList, setCropList] = useState<OnboardingCropItem[]>([]);
  const [addCropName, setAddCropName] = useState("");
  const [addCropVariety, setAddCropVariety] = useState("");
  const [addCropArea, setAddCropArea] = useState("");
  const [addCropSeason, setAddCropSeason] = useState<"Rabi" | "Kharif" | "Zaid">("Rabi");
  const [addCropSowingDate, setAddCropSowingDate] = useState("");
  const [addCropHarvestDate, setAddCropHarvestDate] = useState("");

  // STEP 4: Soil Configuration
  const [soilPathway, setSoilPathway] = useState<"know" | "report" | "unknown">(
    "unknown"
  );
  const [soilType, setSoilType] = useState<
    "alluvial" | "black" | "red" | "laterite" | "clayey" | "sandy_loam"
  >("alluvial");
  const [nitrogenN, setNitrogenN] = useState("");
  const [phosphorusP, setPhosphorusP] = useState("");
  const [potassiumK, setPotassiumK] = useState("");
  const [soilPh, setSoilPh] = useState("");
  const [organicCarbon, setOrganicCarbon] = useState("");
  const [soilReportUploaded, setSoilReportUploaded] = useState<string | null>(null);

  // STEP 5: Farming Needs & Goals
  const [selectedNeeds, setSelectedNeeds] = useState<string[]>([]);

  // Load saved draft from LocalStorage if available (Section 45)
  useEffect(() => {
    const savedDraft = localStorage.getItem("kisan_onboarding_draft");
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        if (parsed.farmerName) setFarmerName(parsed.farmerName);
        if (parsed.age) setAge(parsed.age);
        if (parsed.preferredLanguage) setPreferredLanguage(parsed.preferredLanguage);
        if (parsed.state) setState(parsed.state);
        if (parsed.district) setDistrict(parsed.district);
        if (parsed.subDistrict) setSubDistrict(parsed.subDistrict);
        if (parsed.village) setVillage(parsed.village);
        if (parsed.farmName) setFarmName(parsed.farmName);
        if (parsed.farmSize) setFarmSize(parsed.farmSize);
        if (parsed.sizeUnit) setSizeUnit(parsed.sizeUnit);
        if (parsed.irrigation) setIrrigation(parsed.irrigation);
        if (parsed.landType) setLandType(parsed.landType);
        if (parsed.ownership) setOwnership(parsed.ownership);
        if (Array.isArray(parsed.cropList)) setCropList(parsed.cropList);
        if (parsed.soilPathway) setSoilPathway(parsed.soilPathway);
        if (parsed.soilType) setSoilType(parsed.soilType);
        if (parsed.nitrogenN) setNitrogenN(parsed.nitrogenN);
        if (parsed.phosphorusP) setPhosphorusP(parsed.phosphorusP);
        if (parsed.potassiumK) setPotassiumK(parsed.potassiumK);
        if (parsed.soilPh) setSoilPh(parsed.soilPh);
        if (Array.isArray(parsed.selectedNeeds)) setSelectedNeeds(parsed.selectedNeeds);
        if (parsed.step) setStep(parsed.step);

        setIsDraftRestored(true);
      } catch (e) {
        console.error("Failed to restore onboarding draft", e);
      }
    }
  }, []);

  // Auto-save draft whenever inputs change
  useEffect(() => {
    const draftData = {
      step,
      farmerName,
      age,
      preferredLanguage,
      state,
      district,
      subDistrict,
      village: village === "custom" ? customVillage : village,
      farmName,
      farmSize,
      sizeUnit,
      irrigation,
      landType,
      ownership,
      cropList,
      soilPathway,
      soilType,
      nitrogenN,
      phosphorusP,
      potassiumK,
      soilPh,
      selectedNeeds,
    };
    localStorage.setItem("kisan_onboarding_draft", JSON.stringify(draftData));
  }, [
    step,
    farmerName,
    age,
    preferredLanguage,
    state,
    district,
    subDistrict,
    village,
    customVillage,
    farmName,
    farmSize,
    sizeUnit,
    irrigation,
    landType,
    ownership,
    cropList,
    soilPathway,
    soilType,
    nitrogenN,
    phosphorusP,
    potassiumK,
    soilPh,
    selectedNeeds,
  ]);

  // Handle dependent location cascades
  const handleStateChange = (newState: string) => {
    setState(newState);
    const districts = getDistrictsForState(newState);
    if (districts.length > 0) {
      setDistrict(districts[0]);
      const subDistricts = getSubDistrictsForDistrict(newState, districts[0]);
      if (subDistricts.length > 0) {
        setSubDistrict(subDistricts[0]);
        const villages = getVillagesForSubDistrict(newState, districts[0], subDistricts[0]);
        setVillage(villages.length > 0 ? villages[0] : "custom");
      }
    }
  };

  const handleDistrictChange = (newDistrict: string) => {
    setDistrict(newDistrict);
    const subDistricts = getSubDistrictsForDistrict(state, newDistrict);
    if (subDistricts.length > 0) {
      setSubDistrict(subDistricts[0]);
      const villages = getVillagesForSubDistrict(state, newDistrict, subDistricts[0]);
      setVillage(villages.length > 0 ? villages[0] : "custom");
    }
  };

  const handleSubDistrictChange = (newSubDistrict: string) => {
    setSubDistrict(newSubDistrict);
    const villages = getVillagesForSubDistrict(state, district, newSubDistrict);
    setVillage(villages.length > 0 ? villages[0] : "custom");
  };

  // Validation before advancing to next step (Section 46)
  const validateCurrentStep = (): boolean => {
    setValidationError(null);

    if (step === 1) {
      if (!farmerName.trim() || farmerName.trim().length < 3) {
        setValidationError("Please enter your full name (at least 3 characters).");
        return false;
      }
      if (!state || !district || !subDistrict) {
        setValidationError("Please select your State, District, and Sub-district.");
        return false;
      }
      if (village === "custom" && !customVillage.trim()) {
        setValidationError("Please enter your village name.");
        return false;
      }
    } else if (step === 2) {
      if (!farmName.trim()) {
        setValidationError("Please provide a name or identification for your farm holding.");
        return false;
      }
      const parsedSize = parseFloat(farmSize);
      if (isNaN(parsedSize) || parsedSize <= 0) {
        setValidationError("Please enter a valid farm holding size greater than 0.");
        return false;
      }
    } else if (step === 3) {
      if (cropList.length === 0) {
        setValidationError(
          "Please add at least one crop currently grown or planned on this farm."
        );
        return false;
      }
    } else if (step === 4) {
      if (soilPathway === "know") {
        if (soilPh && (parseFloat(soilPh) < 3.5 || parseFloat(soilPh) > 10.5)) {
          setValidationError("Soil pH must typically fall between 3.5 and 10.5.");
          return false;
        }
      }
    } else if (step === 5) {
      if (selectedNeeds.length === 0) {
        setValidationError("Please select at least one farming priority or interest.");
        return false;
      }
    }

    return true;
  };

  const handleNextStep = () => {
    if (!validateCurrentStep()) return;
    const next = step + 1;
    setStep(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePrevStep = () => {
    setValidationError(null);
    const prev = Math.max(step - 1, 1);
    setStep(prev);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleClearDraft = () => {
    localStorage.removeItem("kisan_onboarding_draft");
    setFarmerName(user?.name || "");
    setFarmName("");
    setFarmSize("");
    setCropList([]);
    setSelectedNeeds([]);
    setStep(1);
    setIsDraftRestored(false);
    showToast({
      type: "info",
      title: "Draft Reset",
      message: "Onboarding form cleared. Starting fresh.",
    });
  };

  const toggleNeed = (need: string) => {
    setValidationError(null);
    setSelectedNeeds((prev) =>
      prev.includes(need) ? prev.filter((n) => n !== need) : [...prev, need]
    );
  };

  const handleAddCrop = () => {
    if (!addCropName.trim()) {
      showToast({
        type: "error",
        title: "Missing Crop Name",
        message: "Please enter the crop name (e.g. Wheat, Mustard, Paddy).",
      });
      return;
    }
    const areaVal = parseFloat(addCropArea);
    if (isNaN(areaVal) || areaVal <= 0) {
      showToast({
        type: "error",
        title: "Invalid Crop Area",
        message: "Allocated area must be a positive number.",
      });
      return;
    }

    const newCrop: OnboardingCropItem = {
      id: `crop-${Date.now()}`,
      name: addCropName.trim(),
      variety: addCropVariety.trim() || "Standard Regional Variety",
      area: addCropArea,
      season: addCropSeason,
      sowingDate: addCropSowingDate || new Date().toISOString().split("T")[0],
      expectedHarvest: addCropHarvestDate || "2026-03-30",
    };

    setCropList([...cropList, newCrop]);
    setAddCropName("");
    setAddCropVariety("");
    setAddCropArea("");
    setAddCropSowingDate("");
    setAddCropHarvestDate("");
    setValidationError(null);

    showToast({
      type: "success",
      title: "Crop Registered",
      message: `${newCrop.name} added to your farm profile.`,
    });
  };

  const handleRemoveCrop = (id: string) => {
    setCropList(cropList.filter((c) => c.id !== id));
  };

  const handleFinishOnboarding = () => {
    const finalVillage = village === "custom" ? customVillage || "Village Area" : village;

    // Commit profile and farm to Session
    updateUser({
      name: farmerName.trim() || "Farmer",
      language: preferredLanguage,
      state,
      district,
    });
    setLanguage(preferredLanguage);

    const savedFarm = addFarm({
      name: farmName.trim() || `${farmerName.trim()}'s Farm Holding`,
      location: `${finalVillage}, ${subDistrict}, ${district}`,
      district,
      state,
      pinCode: "226102",
      acres: parseFloat(farmSize) || 3.0,
      landType,
      irrigation,
      soilType,
      coordinates: { lat: 26.9214, lng: 80.7126 },
      healthScore: 85,
      activeCropsCount: cropList.length,
      documentsCount: soilReportUploaded ? 1 : 0,
    });

    // Save crops into local storage for this farm
    if (cropList.length > 0) {
      const formattedCrops = cropList.map((c, idx) => ({
        id: `crop-${Date.now()}-${idx}`,
        farmId: savedFarm.id,
        farmName: savedFarm.name,
        name: c.name,
        variety: c.variety,
        areaAcres: parseFloat(c.area) || 1.0,
        sowingDate: c.sowingDate,
        expectedHarvest: c.expectedHarvest,
        season: c.season,
        currentStage: "Vegetative",
        health: "good",
        pestRisk: "low",
        diseaseRisk: "low",
        weatherCondition: "Seasonal standard",
        irrigationStatus: "Adequate moisture level",
        notes: "Onboarded during initial farm setup.",
      }));
      localStorage.setItem("kisan_crops", JSON.stringify(formattedCrops));
    }

    setOnboarded(true);
    localStorage.removeItem("kisan_onboarding_draft");

    showToast({
      type: "success",
      title: "Welcome to Kisan Setu!",
      message: "Your farm profile is ready. Launching your dashboard.",
    });

    router.push("/farmer");
  };

  const needsList = [
    { id: "Crop Health", icon: "🌱", label: "Crop Health & Leaf Diseases" },
    { id: "Weather", icon: "🌦️", label: "Hyperlocal Weather & Rain Advisories" },
    { id: "Irrigation", icon: "💧", label: "Irrigation Scheduling & Soil Moisture" },
    { id: "Soil", icon: "🧪", label: "Soil Testing & Fertilizer Dosage" },
    { id: "Pest & Disease", icon: "🐛", label: "Pest Risk Alerts & Bio-Remedies" },
    { id: "Market Prices", icon: "📈", label: "Live APMC Mandi Rates & Alerts" },
    { id: "Government Schemes", icon: "🏛️", label: "PM-KISAN, PMFBY Subsidies" },
    { id: "AI Farming Assistant", icon: "🤖", label: "Kisan AI Bilingual Assistant" },
    { id: "Expert Consultation", icon: "👨‍🌾", label: "1-on-1 Agronomist Support" },
  ];

  return (
    <div className="w-full min-h-[100dvh] flex flex-col bg-background relative py-6 px-4 sm:px-6 lg:px-10">
      {/* Top Guided Setup Header (Section 34) */}
      <div className="w-full max-w-4xl mx-auto flex flex-col gap-4 mb-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 select-none">
            <div className="w-9 h-9 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shadow-xs">
              <Sprout className="w-5 h-5" />
            </div>
            <span className="text-base font-black tracking-tight text-foreground">
              KISAN SETU
            </span>
          </Link>

          <div className="flex items-center gap-3 text-xs">
            {isDraftRestored && (
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 font-medium text-[11px]">
                <CheckCircle2 className="w-3 h-3" /> Draft restored
              </span>
            )}
            <span className="font-bold text-emerald-700 dark:text-emerald-400">
              {step <= 5 ? `Step ${step} of 5` : "Setup Complete"}
            </span>
            <button
              onClick={handleClearDraft}
              className="text-foreground/45 hover:text-foreground text-xs flex items-center gap-1"
              title="Clear unfinished form data and restart"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 rounded-full bg-black/5 dark:bg-white/10 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${Math.min(100, Math.round((step / 5) * 100))}%` }}
          />
        </div>

        {/* Validation Error Banner */}
        {validationError && (
          <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-800 dark:text-rose-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{validationError}</span>
          </div>
        )}
      </div>

      {/* Main Wizard Form Container */}
      <div className="w-full max-w-4xl mx-auto flex-1 flex flex-col justify-center">
        <GlassCard className="p-6 sm:p-10 relative overflow-hidden shadow-2xl">
          {/* Specular sheen */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/80 dark:via-white/20 to-transparent" />

          {/* =========================================================================
              STEP 1: Tell Us About You (Section 35)
              ========================================================================= */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <GlassBadge variant="success" size="sm" className="mb-2">
                  Personal Information
                </GlassBadge>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                  Tell Us About You
                </h2>
                <p className="text-xs sm:text-sm text-foreground/60 mt-1">
                  We customize advisory language and regional agricultural calendars for your location.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <GlassInput
                  label="Full Name *"
                  placeholder="e.g. Rameshwar Prasad Patel"
                  value={farmerName}
                  onChange={(e) => {
                    setFarmerName(e.target.value);
                    setValidationError(null);
                  }}
                  iconLeft={<User className="w-4 h-4" />}
                  required
                />
                <GlassInput
                  label="Age (Optional)"
                  placeholder="e.g. 42"
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                />
              </div>

              <GlassSelect
                label="Preferred Language / भाषा *"
                value={preferredLanguage}
                onChange={(e) => setPreferredLanguage(e.target.value)}
                options={SUPPORTED_LANGUAGES.map((l) => ({
                  value: l.code,
                  label: `${l.nativeName} (${l.name})`,
                }))}
              />

              {/* Dependent Location Selectors: State → District → Sub-district → Village */}
              <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 space-y-4">
                <div className="text-xs font-bold text-foreground flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Farm Geographic Location *</span>
                  </div>
                  <span className="text-[11px] font-normal text-foreground/50">
                    Dependent administrative hierarchy
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <GlassSelect
                    label="State / राज्य *"
                    value={state}
                    onChange={(e) => handleStateChange(e.target.value)}
                    options={availableStates.map((st) => ({
                      value: st,
                      label: st,
                    }))}
                  />

                  <GlassSelect
                    label="District / जिला *"
                    value={district}
                    onChange={(e) => handleDistrictChange(e.target.value)}
                    options={availableDistricts.map((dst) => ({
                      value: dst,
                      label: dst,
                    }))}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <GlassSelect
                    label="Sub-District / Tehsil / तहसील *"
                    value={subDistrict}
                    onChange={(e) => handleSubDistrictChange(e.target.value)}
                    options={availableSubDistricts.map((sub) => ({
                      value: sub,
                      label: sub,
                    }))}
                  />

                  <div>
                    <GlassSelect
                      label="Village / ग्राम *"
                      value={village}
                      onChange={(e) => setVillage(e.target.value)}
                      options={[
                        ...availableVillages.map((v) => ({
                          value: v,
                          label: v,
                        })),
                        { value: "custom", label: "+ Other / Type Custom Village" },
                      ]}
                    />

                    {village === "custom" && (
                      <div className="mt-2">
                        <GlassInput
                          placeholder="Enter your village name"
                          value={customVillage}
                          onChange={(e) => setCustomVillage(e.target.value)}
                          required
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              STEP 2: Tell Us About Your Farm (Section 36)
              ========================================================================= */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <GlassBadge variant="success" size="sm" className="mb-2">
                  Land Holding
                </GlassBadge>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                  Tell Us About Your Farm
                </h2>
                <p className="text-xs sm:text-sm text-foreground/60 mt-1">
                  Specify land size, irrigation sources, and soil classification for tailored water advisories.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <GlassInput
                    label="Holding / Farm Name *"
                    placeholder="e.g. Shivalik Organic Holding"
                    value={farmName}
                    onChange={(e) => {
                      setFarmName(e.target.value);
                      setValidationError(null);
                    }}
                    iconLeft={<Tractor className="w-4 h-4" />}
                    required
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-foreground/80">
                      Total Area *
                    </label>
                    <div className="flex items-center gap-1 text-[10px] font-bold">
                      <button
                        type="button"
                        onClick={() => setSizeUnit("Acres")}
                        className={`px-1.5 py-0.5 rounded-sm transition ${
                          sizeUnit === "Acres"
                            ? "bg-emerald-600 text-white"
                            : "bg-black/10 dark:bg-white/10 text-foreground/60"
                        }`}
                      >
                        Acres
                      </button>
                      <button
                        type="button"
                        onClick={() => setSizeUnit("Hectares")}
                        className={`px-1.5 py-0.5 rounded-sm transition ${
                          sizeUnit === "Hectares"
                            ? "bg-emerald-600 text-white"
                            : "bg-black/10 dark:bg-white/10 text-foreground/60"
                        }`}
                      >
                        Ha
                      </button>
                    </div>
                  </div>
                  <GlassInput
                    type="number"
                    step="0.1"
                    placeholder="e.g. 4.5"
                    value={farmSize}
                    onChange={(e) => {
                      setFarmSize(e.target.value);
                      setValidationError(null);
                    }}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <GlassSelect
                  label="Primary Irrigation Source *"
                  value={irrigation}
                  onChange={(e) => setIrrigation(e.target.value as any)}
                  options={[
                    { value: "drip", label: "Drip Irrigation (ड्रिप)" },
                    { value: "sprinkler", label: "Sprinkler (फव्वारा)" },
                    { value: "borewell", label: "Tube Well / Borewell (नलकूप)" },
                    { value: "canal", label: "Canal Water (नहर)" },
                    { value: "rainfed", label: "Rainfed Only (वर्षा आधारित)" },
                  ]}
                />

                <GlassSelect
                  label="Land Topography *"
                  value={landType}
                  onChange={(e) => setLandType(e.target.value as any)}
                  options={[
                    { value: "irrigated", label: "Irrigated Flatland" },
                    { value: "rainfed", label: "Rainfed Upland" },
                    { value: "wetland", label: "Lowland / Wetland" },
                    { value: "dryland", label: "Arid Dryland" },
                  ]}
                />

                <GlassSelect
                  label="Ownership Status"
                  value={ownership}
                  onChange={(e) => setOwnership(e.target.value)}
                  options={[
                    { value: "Owned", label: "Self-Owned (स्वामित्व)" },
                    { value: "Leased", label: "Leased / Tenant (पट्टा)" },
                    { value: "Shared", label: "Batai / Sharecropped (बटाई)" },
                  ]}
                />
              </div>

              {/* Precise Field Location Consent Toggle (Section 36) */}
              <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 flex items-start gap-3">
                <input
                  type="checkbox"
                  id="gpsConsent"
                  checked={useGpsLocation}
                  onChange={(e) => setUseGpsLocation(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded-md accent-emerald-600"
                />
                <label htmlFor="gpsConsent" className="text-xs cursor-pointer">
                  <span className="font-bold text-foreground block">
                    Allow GPS geolocation for hyper-local rainfall forecasting
                  </span>
                  <span className="text-foreground/60 leading-relaxed block mt-0.5">
                    Kisan Setu uses coordinate boundaries exclusively to retrieve micro-climate satellite rain predictions. Your location is never shared with third parties.
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* =========================================================================
              STEP 3: What Do You Grow? (Multi-Crop Builder) (Section 37)
              ========================================================================= */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <GlassBadge variant="success" size="sm" className="mb-2">
                  Crops & Plantings
                </GlassBadge>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                  What Do You Grow?
                </h2>
                <p className="text-xs sm:text-sm text-foreground/60 mt-1">
                  Add all active or planned crops for this season. You can add multiple crops across your acreage.
                </p>
              </div>

              {/* Active Crops List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-foreground/60">
                    Registered Field Crops ({cropList.length})
                  </span>
                  {cropList.length === 0 && (
                    <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                      No crops added yet. Add your primary crop below.
                    </span>
                  )}
                </div>

                {cropList.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {cropList.map((crop) => (
                      <div
                        key={crop.id}
                        className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 flex items-start justify-between gap-3 group"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-foreground truncate">
                              {crop.name}
                            </h4>
                            <GlassBadge variant="neutral" size="sm">
                              {crop.season}
                            </GlassBadge>
                          </div>
                          <p className="text-xs text-foreground/60 mt-0.5">
                            Variety: <strong className="text-foreground">{crop.variety}</strong>
                          </p>
                          <div className="text-[11px] text-foreground/50 mt-1 flex flex-wrap gap-2">
                            <span>Area: {crop.area} {sizeUnit}</span>
                            {crop.sowingDate && <span>• Sown: {crop.sowingDate}</span>}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveCrop(crop.id)}
                          className="p-1.5 rounded-xl text-foreground/40 hover:text-rose-600 hover:bg-rose-500/10 transition"
                          title="Remove crop"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 rounded-2xl border border-dashed border-black/15 dark:border-white/15 text-center text-xs text-foreground/50">
                    Use the form below to register your first crop.
                  </div>
                )}
              </div>

              {/* Add New Crop Panel */}
              <div className="p-4 sm:p-5 rounded-2xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 dark:text-emerald-300">
                  <Plus className="w-4 h-4" />
                  <span>Add Crop to Field</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <GlassInput
                      label="Crop Name *"
                      placeholder="e.g. Wheat (गेहूं), Mustard"
                      value={addCropName}
                      onChange={(e) => setAddCropName(e.target.value)}
                    />
                  </div>
                  <div>
                    <GlassInput
                      label="Variety / Hybrid"
                      placeholder="e.g. HD-2967, Pusa Bold"
                      value={addCropVariety}
                      onChange={(e) => setAddCropVariety(e.target.value)}
                    />
                  </div>
                  <div>
                    <GlassInput
                      label={`Area (${sizeUnit}) *`}
                      type="number"
                      step="0.1"
                      placeholder="e.g. 2.5"
                      value={addCropArea}
                      onChange={(e) => setAddCropArea(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <GlassSelect
                      label="Season"
                      value={addCropSeason}
                      onChange={(e) => setAddCropSeason(e.target.value as any)}
                      options={[
                        { value: "Rabi", label: "Rabi (Winter - रबी)" },
                        { value: "Kharif", label: "Kharif (Monsoon - खरीफ)" },
                        { value: "Zaid", label: "Zaid (Summer - ज़ायद)" },
                      ]}
                    />
                  </div>
                  <div>
                    <GlassInput
                      label="Sowing Date"
                      type="date"
                      value={addCropSowingDate}
                      onChange={(e) => setAddCropSowingDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <GlassInput
                      label="Expected Harvest Date"
                      type="date"
                      value={addCropHarvestDate}
                      onChange={(e) => setAddCropHarvestDate(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <GlassButton
                    type="button"
                    variant="primary"
                    size="sm"
                    onClick={handleAddCrop}
                    iconLeft={<Plus className="w-4 h-4" />}
                  >
                    Add This Crop
                  </GlassButton>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              STEP 4: Tell Us About Your Soil (Section 38)
              ========================================================================= */}
          {step === 4 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <GlassBadge variant="success" size="sm" className="mb-2">
                  Soil Health
                </GlassBadge>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                  Tell Us About Your Soil
                </h2>
                <p className="text-xs sm:text-sm text-foreground/60 mt-1">
                  Do not worry if you do not have laboratory test data. Select the option that matches your current knowledge.
                </p>
              </div>

              {/* 3 Clear Pathways */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setSoilPathway("know")}
                  className={`p-4 rounded-2xl border text-left transition ${
                    soilPathway === "know"
                      ? "bg-emerald-500/10 border-emerald-600 shadow-xs"
                      : "bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 hover:border-emerald-500/40"
                  }`}
                >
                  <span className="text-xl mb-1 block">🧪</span>
                  <div className="text-xs font-bold text-foreground">
                    I know my soil values
                  </div>
                  <div className="text-[11px] text-foreground/60 mt-0.5 leading-snug">
                    Enter Soil Type, NPK macronutrients, and pH level.
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSoilPathway("report")}
                  className={`p-4 rounded-2xl border text-left transition ${
                    soilPathway === "report"
                      ? "bg-emerald-500/10 border-emerald-600 shadow-xs"
                      : "bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 hover:border-emerald-500/40"
                  }`}
                >
                  <span className="text-xl mb-1 block">📄</span>
                  <div className="text-xs font-bold text-foreground">
                    I have a Soil Health Card
                  </div>
                  <div className="text-[11px] text-foreground/60 mt-0.5 leading-snug">
                    Upload your official government laboratory PDF or photo.
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSoilPathway("unknown")}
                  className={`p-4 rounded-2xl border text-left transition ${
                    soilPathway === "unknown"
                      ? "bg-emerald-500/10 border-emerald-600 shadow-xs"
                      : "bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 hover:border-emerald-500/40"
                  }`}
                >
                  <span className="text-xl mb-1 block">🌱</span>
                  <div className="text-xs font-bold text-foreground">
                    I don&apos;t know yet
                  </div>
                  <div className="text-[11px] text-foreground/60 mt-0.5 leading-snug">
                    We will apply regional district ICAR soil norms for now.
                  </div>
                </button>
              </div>

              {/* Pathway 1: Manual Values */}
              {soilPathway === "know" && (
                <div className="p-4 sm:p-6 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 space-y-4">
                  <GlassSelect
                    label="Soil Texture / Classification"
                    value={soilType}
                    onChange={(e) => setSoilType(e.target.value as any)}
                    options={[
                      { value: "alluvial", label: "Alluvial Soil (जलोढ़ मिट्टी) - Gangetic plain" },
                      { value: "black", label: "Black Soil / Regur (काली मिट्टी) - Deccan" },
                      { value: "red", label: "Red & Yellow Soil (लाल मिट्टी)" },
                      { value: "laterite", label: "Laterite Soil (लेटराइट)" },
                      { value: "clayey", label: "Clayey Loam (चिकनी दोमट)" },
                      { value: "sandy_loam", label: "Sandy Loam (बलुई दोमट)" },
                    ]}
                  />

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <GlassInput
                      label="Available N (kg/ha)"
                      type="number"
                      placeholder="e.g. 240"
                      value={nitrogenN}
                      onChange={(e) => setNitrogenN(e.target.value)}
                    />
                    <GlassInput
                      label="Available P (kg/ha)"
                      type="number"
                      placeholder="e.g. 18"
                      value={phosphorusP}
                      onChange={(e) => setPhosphorusP(e.target.value)}
                    />
                    <GlassInput
                      label="Available K (kg/ha)"
                      type="number"
                      placeholder="e.g. 210"
                      value={potassiumK}
                      onChange={(e) => setPotassiumK(e.target.value)}
                    />
                    <GlassInput
                      label="Soil pH"
                      type="number"
                      step="0.1"
                      placeholder="e.g. 7.2"
                      value={soilPh}
                      onChange={(e) => setSoilPh(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* Pathway 2: Upload Soil Health Card */}
              {soilPathway === "report" && (
                <div className="p-4 sm:p-6 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 space-y-3">
                  <div className="text-xs font-bold text-foreground">
                    Upload Soil Health Card (मृदा स्वास्थ्य पत्रक)
                  </div>
                  <GlassUpload
                    onFileSelect={(file, base64) => {
                      setSoilReportUploaded(file.name);
                      showToast({
                        type: "success",
                        title: "Document Attached",
                        message: `${file.name} ready for OCR extraction.`,
                      });
                    }}
                    onClear={() => setSoilReportUploaded(null)}
                    title="Drop Soil Health Card PDF or Photo"
                    hint="Supports PDF, PNG, JPG up to 10MB"
                  />
                  {soilReportUploaded && (
                    <div className="flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-400 font-medium">
                      <FileText className="w-4 h-4" />
                      <span>Attached: {soilReportUploaded}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Pathway 3: Regional Default Notice */}
              {soilPathway === "unknown" && (
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-950 dark:text-emerald-200 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
                  <div className="leading-relaxed">
                    <strong>Standard Regional Baseline:</strong> We will configure your advisory based on ICAR geological maps for {district}, {state}. You can update specific soil test values anytime in your Soil Dashboard.
                  </div>
                </div>
              )}
            </div>
          )}

          {/* =========================================================================
              STEP 5: Farming Needs & Goals (Section 39)
              ========================================================================= */}
          {step === 5 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <GlassBadge variant="success" size="sm" className="mb-2">
                  Personalization
                </GlassBadge>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                  What Do You Need Help With?
                </h2>
                <p className="text-xs sm:text-sm text-foreground/60 mt-1">
                  Select your primary priorities so we can prioritize high-impact widgets on your dashboard.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {needsList.map((item) => {
                  const isSelected = selectedNeeds.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleNeed(item.id)}
                      className={`p-4 rounded-2xl border text-left transition flex items-center justify-between gap-3 ${
                        isSelected
                          ? "bg-emerald-600 text-white border-emerald-600 shadow-md scale-[1.01]"
                          : "bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 hover:border-emerald-500/40 text-foreground"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{item.icon}</span>
                        <span className="text-xs font-bold leading-snug">
                          {item.label}
                        </span>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                          isSelected
                            ? "bg-white text-emerald-700"
                            : "border border-black/20 dark:border-white/20"
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* =========================================================================
              STEP 6: Summary & Launch (Section 40)
              ========================================================================= */}
          {step === 6 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="text-center max-w-lg mx-auto">
                <div className="w-14 h-14 rounded-3xl bg-emerald-600 text-white flex items-center justify-center mx-auto mb-3 shadow-lg shadow-emerald-600/30">
                  <Sparkles className="w-7 h-7" />
                </div>
                <GlassBadge variant="success" size="sm" className="mb-2">
                  Profile Snapshot
                </GlassBadge>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                  Your Farm Profile Is Ready
                </h2>
                <p className="text-xs sm:text-sm text-foreground/60 mt-1">
                  Please review your farm configuration before entering the Kisan Setu dashboard.
                </p>
              </div>

              {/* Review Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 space-y-2">
                  <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <User className="w-4 h-4 text-emerald-600" />
                    <span>Farmer & Location</span>
                  </div>
                  <div className="text-xs text-foreground/80 space-y-1">
                    <div><strong>Name:</strong> {farmerName || "Farmer"}</div>
                    <div><strong>Location:</strong> {village === "custom" ? customVillage : village}, {subDistrict}, {district}, {state}</div>
                    <div><strong>Language:</strong> {preferredLanguage.toUpperCase()}</div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 space-y-2">
                  <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <Tractor className="w-4 h-4 text-emerald-600" />
                    <span>Farm Holding</span>
                  </div>
                  <div className="text-xs text-foreground/80 space-y-1">
                    <div><strong>Farm:</strong> {farmName || "Primary Holding"}</div>
                    <div><strong>Size:</strong> {farmSize || "3.0"} {sizeUnit}</div>
                    <div><strong>Irrigation:</strong> {irrigation.toUpperCase()} • {landType}</div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 space-y-2">
                  <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <Sprout className="w-4 h-4 text-emerald-600" />
                    <span>Active Crops ({cropList.length})</span>
                  </div>
                  <div className="text-xs text-foreground/80 space-y-1">
                    {cropList.map((c) => (
                      <div key={c.id}>• {c.name} ({c.variety}) - {c.area} {sizeUnit}</div>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 space-y-2">
                  <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>Selected Priorities ({selectedNeeds.length})</span>
                  </div>
                  <div className="text-xs text-foreground/80 flex flex-wrap gap-1">
                    {selectedNeeds.map((n) => (
                      <span key={n} className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 font-semibold text-[11px]">
                        {n}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button to Launch Dashboard */}
              <div className="pt-4 flex flex-col items-center gap-3">
                <GlassButton
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto sm:px-12 py-3.5 text-sm font-bold shadow-lg shadow-emerald-700/20"
                  onClick={handleFinishOnboarding}
                  iconRight={<ArrowRight className="w-4 h-4" />}
                >
                  Enter Kisan Setu Dashboard
                </GlassButton>
                <span className="text-[11px] text-foreground/50">
                  You can edit all farm settings at any time inside your account.
                </span>
              </div>
            </div>
          )}

          {/* Navigation Controls (Back & Next) */}
          {step <= 5 && (
            <div className="mt-8 pt-6 border-t border-black/5 dark:border-white/5 flex items-center justify-between">
              {step > 1 ? (
                <GlassButton
                  variant="secondary"
                  size="sm"
                  onClick={handlePrevStep}
                  iconLeft={<ArrowLeft className="w-4 h-4" />}
                >
                  Back
                </GlassButton>
              ) : (
                <div />
              )}

              <GlassButton
                variant="primary"
                size="sm"
                onClick={handleNextStep}
                iconRight={<ArrowRight className="w-4 h-4" />}
              >
                {step === 5 ? "Review Summary" : "Continue"}
              </GlassButton>
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
}
