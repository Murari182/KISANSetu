"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { KeyRound, ArrowRight, ArrowLeft, Phone, CheckCircle2 } from "lucide-react";
import { GlassCard } from "@/components/glass/GlassCard";
import { GlassButton } from "@/components/glass/GlassButton";
import { GlassInput } from "@/components/glass/GlassInput";
import { useToast } from "@/lib/toast";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [mobile, setMobile] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{10}$/.test(mobile.replace(/\D/g, ""))) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSent(true);
      showToast({
        type: "success",
        title: "Reset Code Sent",
        message: "Check your phone for the 6-digit password reset code.",
      });
    }, 700);
  };

  return (
    <div className="w-full max-w-md mx-auto py-12">
      <GlassCard className="p-8 text-center">
        <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center mx-auto mb-4 shadow-md">
          <KeyRound className="w-6 h-6" />
        </div>

        <h2 className="text-2xl font-extrabold text-foreground">Reset Password</h2>
        <p className="text-xs text-foreground/60 mt-1 mb-6">
          Enter your registered mobile number to receive a verification OTP.
        </p>

        {!isSent ? (
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <GlassInput
              label="Registered Mobile Number"
              placeholder="10-digit mobile number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              iconLeft={<Phone className="w-4 h-4" />}
              type="tel"
              required
            />

            <GlassButton
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              loading={isSubmitting}
              iconRight={<ArrowRight className="w-4 h-4" />}
            >
              Send Reset Code
            </GlassButton>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-emerald-500/10 text-emerald-900 dark:text-emerald-200 text-xs">
              A temporary reset code has been sent to +91 {mobile}.
            </div>
            <Link href="/login">
              <GlassButton variant="primary" size="md" className="w-full">
                Return to Login
              </GlassButton>
            </Link>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-black/5 dark:border-white/5">
          <Link
            href="/login"
            className="text-xs text-foreground/60 hover:text-foreground flex items-center justify-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
          </Link>
        </div>
      </GlassCard>
    </div>
  );
}
