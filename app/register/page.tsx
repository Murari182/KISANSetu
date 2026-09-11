"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sprout,
  ArrowRight,
  ShieldCheck,
  Phone,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Globe,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { GlassCard } from "@/components/glass/GlassCard";
import { GlassButton } from "@/components/glass/GlassButton";
import { GlassInput } from "@/components/glass/GlassInput";
import { GlassSelect } from "@/components/glass/GlassSelect";
import { GlassBadge } from "@/components/glass/GlassBadge";
import { useSession } from "@/lib/auth";
import { useTranslation } from "@/lib/i18n";
import { useToast } from "@/lib/toast";
import { SUPPORTED_LANGUAGES } from "@/lib/i18n/languages";
import { UserRole } from "@/types";

export default function RegisterPage() {
  const router = useRouter();
  const { updateUser, setRole } = useSession();
  const { t, setLanguage } = useTranslation();
  const { showToast } = useToast();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [preferredLang, setPreferredLang] = useState("en");
  const [selectedRole, setSelectedRole] = useState<UserRole>("farmer");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim() || fullName.trim().length < 3) {
      setError("Please enter your full name (minimum 3 characters).");
      return;
    }
    if (!/^\d{10}$/.test(phone.replace(/\D/g, ""))) {
      setError("Please enter a valid 10-digit Indian mobile number.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);

      // Save provisional registration state
      setRole(selectedRole);
      updateUser({
        name: fullName,
        phone: `+91 ${phone}`,
        email: email || undefined,
        language: preferredLang,
        role: selectedRole,
      });
      setLanguage(preferredLang);

      // Save mobile for OTP verification screen
      localStorage.setItem("kisan_pending_mobile", phone);

      showToast({
        type: "success",
        title: "Registration Initiated",
        message: "We've sent a 6-digit verification code to your mobile number.",
      });

      router.push("/verify-otp");
    }, 600);
  };

  return (
    <div className="w-full min-h-[100dvh] flex flex-col lg:flex-row bg-background">
      {/* Left Column (Desktop): Cinematic Agricultural Visual & Brand Story (Section 28) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-tr from-emerald-950 via-emerald-900 to-[#0a1710] text-white p-12 xl:p-16 flex-col justify-between overflow-hidden">
        {/* Subtle background photo overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20 pointer-events-none mix-blend-overlay"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1592982537447-7440770cbfc9?q=80&w=1500&auto=format&fit=crop')",
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

        {/* Middle Testimonial / Value Pillars */}
        <div className="relative z-10 max-w-lg space-y-6">
          <GlassBadge variant="success" size="md">
            Join 2.4 Million Indian Farmers
          </GlassBadge>

          <h2 className="text-3xl xl:text-4xl font-extrabold tracking-tight leading-tight">
            &quot;Kisan Setu helped me time my wheat irrigation perfectly before the rain,
            saving my crop and fertilizer.&quot;
          </h2>

          <div className="flex items-center gap-3 pt-2">
            <div className="w-12 h-12 rounded-full bg-emerald-700/80 border border-white/20 flex items-center justify-center font-bold text-sm">
              RP
            </div>
            <div>
              <div className="font-bold text-sm">Rameshwar Prasad Patel</div>
              <div className="text-xs text-emerald-200">
                Wheat & Mustard Farmer • Lucknow, Uttar Pradesh
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Trust Indicators */}
        <div className="relative z-10 flex items-center gap-6 text-xs text-emerald-200/80 border-t border-white/10 pt-6">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Encrypted Farmer Data</span>
          </div>
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-emerald-400" />
            <span>12 Regional Languages</span>
          </div>
        </div>
      </div>

      {/* Right Column: Registration Form (Section 29) */}
      <div className="flex-1 flex flex-col justify-center p-6 sm:p-10 lg:p-16 xl:p-20 overflow-y-auto">
        <div className="w-full max-w-md mx-auto space-y-6">
          {/* Mobile Brand Link */}
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
              Create Your Kisan Setu Account
            </h1>
            <p className="text-xs sm:text-sm text-foreground/60 mt-1">
              Let&apos;s build your personalized farming experience.
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 text-xs font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <GlassInput
              label="Full Name"
              placeholder="e.g. Ramesh Kumar Patel"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              iconLeft={<User className="w-4 h-4" />}
              required
            />

            <GlassInput
              label="Mobile Number (Used for Login & SMS Alerts)"
              placeholder="10-digit mobile number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              iconLeft={<Phone className="w-4 h-4" />}
              maxLength={10}
              type="tel"
              required
            />

            <GlassInput
              label="Email Address (Optional)"
              placeholder="ramesh@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              iconLeft={<Mail className="w-4 h-4" />}
              type="email"
            />

            <GlassInput
              label="Account Password"
              placeholder="Create a secure password"
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

            <GlassSelect
              label="Preferred Language / भाषा"
              value={preferredLang}
              onChange={(e) => setPreferredLang(e.target.value)}
              options={SUPPORTED_LANGUAGES.map((l) => ({
                value: l.code,
                label: `${l.nativeName} (${l.name})`,
              }))}
            />

            {/* Role Selection (Default: Farmer) */}
            <div>
              <label className="text-xs font-semibold text-foreground/80 mb-1.5 block">
                Registering As
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

            <GlassButton
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              loading={isLoading}
              iconRight={<ArrowRight className="w-4 h-4" />}
            >
              Create Account & Verify Mobile
            </GlassButton>
          </form>

          <div className="pt-4 border-t border-black/5 dark:border-white/5 text-center text-xs text-foreground/60">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-bold text-emerald-700 dark:text-emerald-400 hover:underline"
            >
              Sign In here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
