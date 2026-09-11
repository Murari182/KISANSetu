"use client";

import React, { useState, useEffect } from "react";
import {
  Sun,
  CloudSun,
  CloudRain,
  Wind,
  Droplets,
  Eye,
  AlertTriangle,
  Compass,
  CheckCircle2,
  Calendar,
  Clock,
  Sparkles,
} from "lucide-react";
import { GlassCard } from "@/components/glass/GlassCard";
import { GlassBadge } from "@/components/glass/GlassBadge";
import { GlassStat } from "@/components/glass/GlassBadge";
import { weatherApi } from "@/lib/api";
import { WeatherData } from "@/types";
import { useTranslation } from "@/lib/i18n";

export default function WeatherPage() {
  const { t } = useTranslation();
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    weatherApi.getWeather().then(setWeather);
  }, []);

  if (!weather) return null;

  return (
    <div className="flex flex-col gap-6 py-2">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <GlassBadge variant="warning" size="sm" icon={<CloudSun className="w-3.5 h-3.5" />}>
            Hyperlocal Meteorology
          </GlassBadge>
          <span className="text-xs text-foreground/50">
            IMD & High-Resolution Agromet Forecast
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          {t("weather.title")}
        </h1>
        <p className="text-xs sm:text-sm text-foreground/60 mt-0.5">
          {t("weather.subtitle")}
        </p>
      </div>

      {/* Weather Recommendation Banner (Section 32) */}
      <GlassCard className="p-6 border-emerald-500/30 bg-gradient-to-br from-emerald-50/70 via-white/80 to-emerald-50/30 dark:from-emerald-950/40 dark:via-[#0e1612]/80 dark:to-emerald-950/20">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-emerald-600 text-white shadow-md shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-emerald-950 dark:text-emerald-200">
              {t("weather.farmingRecommendation")}
            </h3>
            <p className="text-xs sm:text-sm text-foreground/80 mt-1 leading-relaxed">
              {weather.farmingRecommendation}
            </p>
          </div>
        </div>
      </GlassCard>

      {/* Current Conditions Large Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard className="p-6 sm:p-8 flex flex-col justify-between lg:col-span-1 bg-gradient-to-tr from-white/90 to-amber-50/40 dark:from-[#0e1612]/90 dark:to-amber-950/10">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-foreground/50">
                Current Field Temperature
              </span>
              <GlassBadge variant="gold" size="sm">
                Live Reading
              </GlassBadge>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div>
                <div className="text-5xl font-black text-foreground">
                  {weather.currentTemp}°C
                </div>
                <div className="text-xs text-foreground/60 mt-1">
                  {t("weather.feelsLike")} {weather.feelsLike}°C • {weather.condition}
                </div>
              </div>
              <div className="p-4 rounded-3xl bg-amber-500/10 text-amber-500 shadow-inner">
                <Sun className="w-12 h-12" />
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-black/5 dark:border-white/5 grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-[10px] text-foreground/50 uppercase font-semibold">
                UV Index
              </span>
              <div className="font-bold text-foreground">{weather.uvIndex} (Moderate)</div>
            </div>
            <div>
              <span className="text-[10px] text-foreground/50 uppercase font-semibold">
                Rain Risk
              </span>
              <div className="font-bold text-emerald-700 dark:text-emerald-400">
                {weather.rainProbabilityPercent}%
              </div>
            </div>
          </div>
        </GlassCard>

        {/* 4 Stats Grid */}
        <div className="lg:col-span-2 grid grid-cols-2 gap-4">
          <GlassStat
            label={t("weather.humidity")}
            value={`${weather.humidity}%`}
            subtitle="Optimal transpiration rate"
            icon={<Droplets className="w-5 h-5" />}
          />
          <GlassStat
            label={t("weather.windSpeed")}
            value={`${weather.windSpeedKmH} km/h`}
            subtitle="Light breeze from NE"
            icon={<Wind className="w-5 h-5" />}
          />
          <GlassStat
            label="Spraying Window"
            value="Favorable"
            change="Next 48 Hours"
            changeType="positive"
            subtitle="Wind < 15km/h; no drift risk"
            icon={<CheckCircle2 className="w-5 h-5" />}
          />
          <GlassStat
            label="Precipitation"
            value={`${weather.rainfallMm} mm`}
            subtitle="No accumulation in last 24h"
            icon={<CloudRain className="w-5 h-5" />}
          />
        </div>
      </div>

      {/* Hourly 24h Outlook */}
      <GlassCard className="p-6">
        <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>{t("weather.hourlyForecast")}</span>
        </h3>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {weather.hourlyForecast.map((hour, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 flex flex-col items-center text-center gap-1.5"
            >
              <span className="text-xs font-semibold text-foreground/60">
                {hour.time}
              </span>
              <Sun className="w-6 h-6 text-amber-500 my-1" />
              <span className="text-sm font-bold text-foreground">
                {hour.temp}°C
              </span>
              <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">
                {hour.pop}% Rain
              </span>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* 7-Day Extended Agricultural Outlook */}
      <GlassCard className="p-6">
        <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>{t("weather.sevenDayForecast")}</span>
        </h3>

        <div className="space-y-2.5">
          {weather.dailyForecast.map((day, idx) => (
            <div
              key={idx}
              className="p-3 rounded-2xl bg-black/5 dark:bg-white/5 flex items-center justify-between gap-4 text-xs"
            >
              <div className="flex items-center gap-3 w-28">
                <span className="font-bold text-foreground">{day.day}</span>
                <span className="text-foreground/50 text-[11px]">{day.date}</span>
              </div>

              <div className="flex items-center gap-2 text-foreground/75">
                {day.rainProb > 40 ? (
                  <CloudRain className="w-4 h-4 text-sky-500" />
                ) : (
                  <Sun className="w-4 h-4 text-amber-500" />
                )}
                <span className="hidden sm:inline">{day.condition}</span>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-[11px] text-sky-600 dark:text-sky-400 font-medium">
                  {day.rainProb}% Rain
                </span>
                <div className="w-20 text-right font-bold text-foreground">
                  {day.maxTemp}° / {day.minTemp}°
                </div>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
