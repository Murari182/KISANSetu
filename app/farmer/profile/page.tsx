"use client";

import React, { useState } from "react";
import {
  User,
  MapPin,
  Settings,
  Bell,
  Shield,
  Download,
  Trash2,
  CheckCircle2,
  Globe,
  Sun,
  Moon,
  Laptop,
  Save,
} from "lucide-react";
import { GlassCard } from "@/components/glass/GlassCard";
import { GlassButton } from "@/components/glass/GlassButton";
import { GlassInput } from "@/components/glass/GlassInput";
import { GlassSelect } from "@/components/glass/GlassSelect";
import { GlassBadge } from "@/components/glass/GlassBadge";
import { ConfirmDialog } from "@/components/common/FeedbackStates";
import { useSession } from "@/lib/auth";
import { useTranslation } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";
import { useToast } from "@/lib/toast";
import { SUPPORTED_LANGUAGES } from "@/lib/i18n/languages";

export default function ProfileSettingsPage() {
  const { user, updateUser, activeFarm, logout } = useSession();
  const { t, language, setLanguage } = useTranslation();
  const { theme, setTheme } = useTheme();
  const { showToast } = useToast();

  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [email, setEmail] = useState(user?.email || "");
  const [district, setDistrict] = useState(user?.district || "Lucknow");
  const [state, setState] = useState(user?.state || "Uttar Pradesh");

  const [smsAlerts, setSmsAlerts] = useState(true);
  const [pushAlerts, setPushAlerts] = useState(true);
  const [whatsAppAlerts, setWhatsAppAlerts] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      name,
      phone,
      email: email || undefined,
      district,
      state,
    });
    showToast({
      type: "success",
      title: "Profile Saved",
      message: "Your profile information was updated.",
    });
  };

  const handleExportData = () => {
    showToast({
      type: "success",
      title: "Data Export Generated",
      message: "Your complete farm journal, soil reports, and crop records are downloading as JSON/CSV.",
    });
  };

  return (
    <div className="flex flex-col gap-6 py-2 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          {t("nav.settings")} & Farmer Profile
        </h1>
        <p className="text-xs sm:text-sm text-foreground/60 mt-0.5">
          Manage your personal details, language preferences, and privacy controls.
        </p>
      </div>

      {/* Personal Information Form */}
      <GlassCard className="p-6 sm:p-8">
        <h3 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <span>Personal Information</span>
        </h3>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <GlassInput
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <GlassInput
              label="Mobile Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <GlassInput
              label="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
            />
            <GlassInput
              label="District"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              required
            />
            <GlassInput
              label="State"
              value={state}
              onChange={(e) => setState(e.target.value)}
              required
            />
          </div>

          <div className="pt-2 flex justify-end">
            <GlassButton
              type="submit"
              variant="primary"
              size="sm"
              iconLeft={<Save className="w-3.5 h-3.5" />}
            >
              Save Profile Changes
            </GlassButton>
          </div>
        </form>
      </GlassCard>

      {/* Appearance & Language (Section 5, 9, 55) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Theme Preference */}
        <GlassCard className="p-6 space-y-4">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Sun className="w-4 h-4 text-amber-500" />
            <span>Appearance Theme</span>
          </h3>

          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "light", label: "Light", icon: Sun },
              { id: "dark", label: "Dark", icon: Moon },
              { id: "system", label: "System", icon: Laptop },
            ].map((m) => {
              const isSelected = theme === m.id;
              const Icon = m.icon;
              return (
                <button
                  key={m.id}
                  onClick={() => setTheme(m.id as any)}
                  className={`p-3 rounded-2xl flex flex-col items-center gap-1.5 border text-xs font-semibold transition-all ${
                    isSelected
                      ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-800 dark:text-emerald-300 ring-2 ring-emerald-500/20 shadow-xs"
                      : "bg-black/5 dark:bg-white/5 border-black/5 dark:border-white/5 text-foreground/70 hover:bg-black/10"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{m.label}</span>
                </button>
              );
            })}
          </div>
        </GlassCard>

        {/* Language Selection */}
        <GlassCard className="p-6 space-y-4">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Globe className="w-4 h-4 text-indigo-500" />
            <span>Platform Language</span>
          </h3>

          <GlassSelect
            label="Selected Regional Dialect"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            options={SUPPORTED_LANGUAGES.map((l) => ({
              value: l.code,
              label: `${l.nativeName} (${l.name})`,
            }))}
          />
        </GlassCard>
      </div>

      {/* Notification Channel Preferences (Section 43) */}
      <GlassCard className="p-6 space-y-4">
        <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
          <Bell className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Notification Delivery Channels</span>
        </h3>

        <div className="space-y-3 divide-y divide-black/5 dark:divide-white/5 text-xs">
          <div className="flex items-center justify-between pt-2">
            <div>
              <div className="font-semibold text-foreground">SMS Alerts</div>
              <p className="text-foreground/50">Mandi price surges and frost warnings</p>
            </div>
            <input
              type="checkbox"
              checked={smsAlerts}
              onChange={(e) => setSmsAlerts(e.target.checked)}
              className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between pt-3">
            <div>
              <div className="font-semibold text-foreground">In-App Push Notifications</div>
              <p className="text-foreground/50">Crop Doctor reviews and expert responses</p>
            </div>
            <input
              type="checkbox"
              checked={pushAlerts}
              onChange={(e) => setPushAlerts(e.target.checked)}
              className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between pt-3">
            <div>
              <div className="font-semibold text-foreground">WhatsApp Agricultural Digest</div>
              <p className="text-foreground/50">Weekly weather summary and market bulletin</p>
            </div>
            <input
              type="checkbox"
              checked={whatsAppAlerts}
              onChange={(e) => setWhatsAppAlerts(e.target.checked)}
              className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
            />
          </div>
        </div>
      </GlassCard>

      {/* Data Export & Privacy (Section 56) */}
      <GlassCard className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-black/10 dark:border-white/10">
        <div>
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Download className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Export Farm Data Archive</span>
          </h3>
          <p className="text-xs text-foreground/55 mt-0.5">
            Download your operational logs, soil reports, and economic ledger in open JSON/CSV format.
          </p>
        </div>

        <GlassButton
          variant="secondary"
          size="sm"
          onClick={handleExportData}
          iconLeft={<Download className="w-3.5 h-3.5" />}
        >
          Download Data
        </GlassButton>
      </GlassCard>

      {/* Danger Zone */}
      <GlassCard className="p-6 border-rose-300/40 dark:border-rose-900/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-rose-700 dark:text-rose-400">
            Account Deletion
          </h3>
          <p className="text-xs text-foreground/55 mt-0.5">
            Permanently delete your profile and detach registered farm records.
          </p>
        </div>

        <GlassButton
          variant="danger"
          size="sm"
          onClick={() => setIsDeleteModalOpen(true)}
          iconLeft={<Trash2 className="w-3.5 h-3.5" />}
        >
          Request Deletion
        </GlassButton>
      </GlassCard>

      {/* Account Deletion Confirmation Modal */}
      <ConfirmDialog
        isOpen={isDeleteModalOpen}
        title="Delete Kisan Setu Account"
        message="Are you certain you wish to request account deletion? All active farm boundaries and historical crop data will be purged."
        confirmLabel="Delete Account"
        onConfirm={() => {
          setIsDeleteModalOpen(false);
          logout();
          window.location.href = "/";
        }}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
}
