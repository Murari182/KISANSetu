"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { GlassNavbar } from "@/components/glass/GlassNavbar";
import { GlassSidebar } from "@/components/glass/GlassSidebar";
import { GlassBottomNavigation } from "@/components/glass/GlassBottomNavigation";
import { OfflineBanner } from "@/components/common/FeedbackStates";
import { FirstVisitLanguageSelection } from "@/components/home/FirstVisitLanguageSelection";
import { useTranslation } from "@/lib/i18n";

interface AppLayoutShellProps {
  children: React.ReactNode;
}

export const AppLayoutShell: React.FC<AppLayoutShellProps> = ({ children }) => {
  const pathname = usePathname();
  const { hasChosenLanguage, isLanguageModalOpen, closeLanguageModal } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Language Gateway: Always prompt user to choose language if not confirmed for this session or if modal is opened
  if (mounted && (!hasChosenLanguage || isLanguageModalOpen)) {
    return <FirstVisitLanguageSelection onContinue={closeLanguageModal} />;
  }

  // Public standalone pages that span full viewport without portal sidebar or portal navbar
  const isPublicPage =
    pathname === "/" ||
    pathname === "/ai" ||
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/verify-otp" ||
    pathname === "/forgot-password" ||
    pathname === "/onboarding";

  if (isPublicPage) {
    return (
      <div className="w-full min-h-[100dvh] flex flex-col relative z-10 overflow-x-hidden">
        <OfflineBanner />
        <main className="w-full flex-1 flex flex-col">{children}</main>
      </div>
    );
  }

  // Authenticated Portal Pages (Farmer, Expert, Admin)
  return (
    <div className="w-full min-h-[100dvh] flex flex-col relative z-10 overflow-x-hidden">
      <OfflineBanner />
      {/* Portal Top Navbar */}
      <GlassNavbar />

      {/* Main Portal Canvas */}
      <div className="flex-1 w-full max-w-[1720px] mx-auto px-3 sm:px-6 pt-2 pb-24 lg:pb-10 flex gap-6">
        <GlassSidebar />
        <main className="flex-1 min-w-0 flex flex-col">{children}</main>
      </div>

      {/* Mobile Portal Bottom Dock */}
      <GlassBottomNavigation />
    </div>
  );
};
