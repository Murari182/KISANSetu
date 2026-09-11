"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sprout,
  Phone,
  Lock,
  ArrowRight,
  ShieldCheck,
  Eye,
  EyeOff,
  Globe,
  CheckCircle2,
} from "lucide-react";
import { GlassCard } from "@/components/glass/GlassCard";
import { GlassButton } from "@/components/glass/GlassButton";
import { GlassInput } from "@/components/glass/GlassInput";
import { GlassBadge } from "@/components/glass/GlassBadge";
import { useSession } from "@/lib/auth";
import { useTranslation } from "@/lib/i18n";
import { useToast } from "@/lib/toast";
import { UserRole } from "@/types";

export default function LoginPage() {
  const router = useRouter();
  const { login, setRole } = useSession();
  const { t } = useTranslation();
  const { showToast } = useToast();

  const [mobileNumber, setMobileNumber] = useState("9876543210");
  const [password, setPassword] = useState("kisan123");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>("farmer");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!/^\d{10}$/.test(mobileNumber.replace(/\D/g, ""))) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }
    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setIsLoading(true);
    setTimeout(async () => {
      setIsLoading(false);
      await login(mobileNumber, selectedRole);
      setRole(selectedRole);

      showToast({
        type: "success",
        title: "Welcome Back",
        message: `Signed in to ${selectedRole} portal.`,
      });

      if (selectedRole === "farmer") router.push("/farmer");
      else if (selectedRole === "expert") router.push("/expert");
      else router.push("/admin");
    }, 600);
  };

  return (
    <div className="w-full min-h-[100dvh] flex flex-col lg:flex-row bg-background">
      {/* Left Column (Desktop): Split-Screen Agricultural Visual (Section 28) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-tr from-emerald-950 via-emerald-900 to-[#0a1710] text-white p-12 xl:p-16 flex-col justify-between overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20 pointer-events-none mix-blend-overlay"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=1500&auto=format&fit=crop')",
          }}
        />

        {/* Brand Header */}
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-3 select-none">
            <div className="w-11 h-11 rounded-2xl bg-white/10 backdrop-blur-md text-white flex items-center justify-center border border-white/20">
              <Sprout className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight block">KISAN SETU</span>
              <span className="text-[11px] text-emerald-300 font-semibold tracking-wider uppercase">
                Smart Agriculture. Better Decisions.
              </span>
            </div>
          </Link>
        </div>

        {/* Middle Feature Highlights */}
        <div className="relative z-10 max-w-lg space-y-6">
          <GlassBadge variant="success" size="md">
            Welcome to Your Digital Farm
          </GlassBadge>

          <h2 className="text-3xl xl:text-4xl font-extrabold tracking-tight leading-tight">
            Connecting every field to verified weather, soil, mandi, and AI intelligence.
          </h2>

          <div className="space-y-3 text-xs text-emerald-100/80">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Prioritized daily farm actions</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Real-time APMC mandi prices and SMS alerts</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Direct access to certified ICAR agronomists</span>
            </div>
          </div>
        </div>

        {/* Bottom Security Assurance */}
        <div className="relative z-10 flex items-center gap-6 text-xs text-emerald-200/80 border-t border-white/10 pt-6">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Multi-factor Security</span>
          </div>
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-emerald-400" />
            <span>28 States & UTs</span>
          </div>
        </div>
      </div>

      {/* Right Column: Sign In Form */}
      <div className="flex-1 flex flex-col justify-center p-6 sm:p-10 lg:p-16 xl:p-20 overflow-y-auto">
        <div className="w-full max-w-md mx-auto space-y-6">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2 mb-2">
            <div className="w-9 h-9 rounded-2xl bg-emerald-700 text-white flex items-center justify-center">
              <Sprout className="w-5 h-5" />
            </div>
            <span className="text-lg font-black tracking-tight text-foreground">
              KISAN SETU
            </span>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              Sign In to Kisan Setu
            </h1>
            <p className="text-xs sm:text-sm text-foreground/60 mt-1">
              Access your farm advisory, market intelligence, and AI assistant.
            </p>
          </div>

          {/* Role Switcher Tabs */}
          <div>
            <label className="text-xs font-semibold text-foreground/80 mb-1.5 block">
              Continue As
            </label>
            <div className="grid grid-cols-3 gap-2 p-1.5 rounded-2xl bg-black/5 dark:bg-white/5">
              {(["farmer", "expert", "admin"] as UserRole[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setSelectedRole(r)}
                  className={`py-2 px-2 rounded-xl text-xs font-semibold capitalize transition ${
                    selectedRole === r
                      ? "bg-white dark:bg-[#14201a] text-emerald-800 dark:text-emerald-300 shadow-sm border border-white/80 dark:border-white/10"
                      : "text-foreground/60 hover:text-foreground"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 text-xs font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <GlassInput
              label="Mobile Number"
              placeholder="10-digit mobile number"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              iconLeft={<Phone className="w-4 h-4" />}
              maxLength={10}
              type="tel"
              required
            />

            <GlassInput
              label="Password"
              placeholder="Enter your password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              iconLeft={<Lock className="w-4 h-4" />}
              iconRight={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1 text-foreground/50 hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
              required
            />

            <div className="flex items-center justify-between text-xs">
              <Link
                href="/forgot-password"
                className="text-emerald-700 dark:text-emerald-400 font-medium hover:underline"
              >
                Forgot Password?
              </Link>
              <Link
                href="/verify-otp"
                className="text-foreground/60 hover:text-foreground hover:underline"
              >
                Sign in with OTP
              </Link>
            </div>

            <GlassButton
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              loading={isLoading}
              iconRight={<ArrowRight className="w-4 h-4" />}
            >
              Sign In to {selectedRole.toUpperCase()} Portal
            </GlassButton>
          </form>

          <div className="pt-4 border-t border-black/5 dark:border-white/5 text-center text-xs text-foreground/60">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-bold text-emerald-700 dark:text-emerald-400 hover:underline"
            >
              Register as a Farmer
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
