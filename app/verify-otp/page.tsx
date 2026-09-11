"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Phone,
} from "lucide-react";
import { GlassCard } from "@/components/glass/GlassCard";
import { GlassButton } from "@/components/glass/GlassButton";
import { GlassBadge } from "@/components/glass/GlassBadge";
import { useToast } from "@/lib/toast";

export default function VerifyOtpPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [mobile, setMobile] = useState("9876543210");
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [resendTimer, setResendTimer] = useState(30);
  const [status, setStatus] = useState<
    "idle" | "verifying" | "verified" | "error" | "expired"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const savedMobile = localStorage.getItem("kisan_pending_mobile");
    if (savedMobile) setMobile(savedMobile);

    const timer = setInterval(() => {
      setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleDigitChange = (index: number, val: string) => {
    setStatus("idle");
    setErrorMessage(null);

    // Handle paste of 6 digits
    if (val.length > 1) {
      const pasted = val.replace(/\D/g, "").slice(0, 6).split("");
      if (pasted.length > 0) {
        const next = [...digits];
        pasted.forEach((char, i) => {
          if (i < 6) next[i] = char;
        });
        setDigits(next);
        const nextIndex = Math.min(pasted.length, 5);
        document.getElementById(`otp-box-${nextIndex}`)?.focus();
      }
      return;
    }

    const next = [...digits];
    next[index] = val;
    setDigits(next);

    // Auto-focus next box
    if (val && index < 5) {
      document.getElementById(`otp-box-${index + 1}`)?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      document.getElementById(`otp-box-${index - 1}`)?.focus();
    }
  };

  const handleResend = () => {
    if (resendTimer > 0) return;
    setResendTimer(30);
    setDigits(["", "", "", "", "", ""]);
    setStatus("idle");
    setErrorMessage(null);

    showToast({
      type: "success",
      title: "New OTP Dispatched",
      message: `A fresh 6-digit verification code was sent to +91 ${mobile}.`,
    });
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const code = digits.join("");
    if (code.length < 6) {
      setStatus("error");
      setErrorMessage("Please enter all 6 digits of the verification code.");
      return;
    }

    setStatus("verifying");

    setTimeout(() => {
      // Simulate verification
      if (code === "000000") {
        setStatus("error");
        setErrorMessage("Invalid OTP code. Please check your SMS or resend.");
        return;
      }

      setStatus("verified");
      showToast({
        type: "success",
        title: "Mobile Verified",
        message: "Your phone number is authenticated. Starting farm setup.",
      });

      setTimeout(() => {
        router.push("/onboarding");
      }, 700);
    }, 800);
  };

  return (
    <div className="w-full min-h-[100dvh] flex items-center justify-center p-4 sm:p-6 bg-background relative">
      <div className="w-full max-w-md">
        <GlassCard className="p-8 sm:p-10 text-center relative overflow-hidden">
          {/* Specular sheen */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/80 dark:via-white/20 to-transparent" />

          <div className="w-14 h-14 rounded-3xl bg-emerald-700 dark:bg-emerald-600 text-white flex items-center justify-center mx-auto mb-5 shadow-lg">
            <ShieldCheck className="w-7 h-7" />
          </div>

          <h1 className="text-2xl font-black tracking-tight text-foreground">
            Verify Your Mobile Number
          </h1>
          <p className="text-xs sm:text-sm text-foreground/60 mt-1.5 leading-relaxed">
            Enter the 6-digit code sent via SMS to{" "}
            <span className="font-bold text-foreground">+91 {mobile}</span>
          </p>

          <div className="mt-2 mb-6">
            <Link
              href="/register"
              className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold hover:underline"
            >
              Change Mobile Number
            </Link>
          </div>

          {errorMessage && (
            <div className="mb-5 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 text-xs font-semibold flex items-center gap-2 text-left">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleVerify} className="space-y-6">
            {/* 6 Digit OTP Inputs (Section 30) */}
            <div className="flex justify-between gap-1.5 sm:gap-2.5">
              {digits.map((d, idx) => (
                <input
                  key={idx}
                  id={`otp-box-${idx}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={d}
                  onChange={(e) => handleDigitChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  disabled={status === "verifying" || status === "verified"}
                  className="w-11 sm:w-13 h-13 sm:h-14 text-center text-xl font-bold rounded-2xl bg-white/80 dark:bg-[#0c1410]/80 border border-black/15 dark:border-white/15 text-foreground focus:outline-none focus:border-emerald-600 focus:ring-3 focus:ring-emerald-500/20 shadow-xs transition-all"
                />
              ))}
            </div>

            <GlassButton
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              loading={status === "verifying"}
              disabled={status === "verified"}
              iconRight={
                status === "verified" ? (
                  <CheckCircle2 className="w-4 h-4 text-white" />
                ) : (
                  <ArrowRight className="w-4 h-4" />
                )
              }
            >
              {status === "verifying"
                ? "Verifying Code..."
                : status === "verified"
                ? "Mobile Verified!"
                : "Verify & Continue"}
            </GlassButton>
          </form>

          {/* Resend OTP Timer & Actions */}
          <div className="mt-6 pt-5 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-xs text-foreground/60">
            <span>Didn&apos;t receive code?</span>

            {resendTimer > 0 ? (
              <span className="font-semibold text-foreground/45">
                Resend in {resendTimer}s
              </span>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                className="font-bold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Resend Code
              </button>
            )}
          </div>

          <div className="mt-4">
            <Link
              href="/login"
              className="text-xs text-foreground/50 hover:text-foreground flex items-center justify-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
            </Link>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
