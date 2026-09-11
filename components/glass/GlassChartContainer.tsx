"use client";

import React from "react";
import { GlassCard } from "./GlassCard";

export interface GlassChartContainerProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  height?: number | string;
  className?: string;
}

export const GlassChartContainer: React.FC<GlassChartContainerProps> = ({
  title,
  subtitle,
  action,
  children,
  height = 300,
  className = "",
}) => {
  return (
    <GlassCard className={`p-5 sm:p-6 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h4 className="text-base font-bold text-foreground tracking-tight">
            {title}
          </h4>
          {subtitle && (
            <p className="text-xs text-foreground/55 mt-0.5">{subtitle}</p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      <div style={{ height, width: "100%" }} className="relative">
        {children}
      </div>
    </GlassCard>
  );
};
