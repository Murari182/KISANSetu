"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Scale,
  Clock,
  Truck,
  CheckCircle2,
  AlertCircle,
  Users,
  Radio,
  RefreshCw,
  Search,
  Filter,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Building2,
} from "lucide-react";
import { GlassCard } from "@/components/glass/GlassCard";
import { GlassButton } from "@/components/glass/GlassButton";
import { GlassBadge } from "@/components/glass/GlassBadge";
import { GlassInput } from "@/components/glass/GlassInput";
import { procurementApi } from "@/lib/api";
import { useToast } from "@/lib/toast";

interface AdminQueueRow {
  token: string;
  farmer: string;
  phone: string;
  crop: string;
  quantityKg: number;
  slot: string;
  status: string;
  statusLabel: string;
  counter: string;
  eta: string;
  badge: "success" | "info" | "warning" | "gold" | "neutral";
  paymentStatus: string;
  isUser?: boolean;
}

export default function AdminProcurementPage() {
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");

  const [queueRows, setQueueRows] = useState<AdminQueueRow[]>([
    {
      token: "A130",
      farmer: "Sukhdev Singh",
      phone: "+91 98111 22334",
      crop: "Paddy",
      quantityKg: 1800,
      slot: "10:00 AM – 10:30 AM",
      status: "BEING_SERVED",
      statusLabel: "At Weighbridge",
      counter: "Counter 2",
      eta: "0 min (Serving)",
      badge: "success" as const,
      paymentStatus: "PENDING",
    },
    {
      token: "A131",
      farmer: "Mahendra Verma",
      phone: "+91 98222 33445",
      crop: "Paddy",
      quantityKg: 1250,
      slot: "10:00 AM – 10:30 AM",
      status: "CALLED",
      statusLabel: "Called to Gate",
      counter: "Counter 3",
      eta: "~2 min",
      badge: "info" as const,
      paymentStatus: "PENDING",
    },
    {
      token: "A132",
      farmer: "Bhanu Pratap Singh",
      phone: "+91 98333 44556",
      crop: "Wheat",
      quantityKg: 2100,
      slot: "10:30 AM – 11:00 AM",
      status: "ARRIVED",
      statusLabel: "Arrived at Gate",
      counter: "Unassigned",
      eta: "~6 min",
      badge: "warning" as const,
      paymentStatus: "PENDING",
    },
    {
      token: "A142",
      farmer: "Rameshwar Prasad Patel",
      phone: "+91 98765 43210",
      crop: "Basmati Paddy",
      quantityKg: 1480,
      slot: "10:30 AM – 11:00 AM",
      status: "SCHEDULED",
      statusLabel: "Token Active (Farmer)",
      counter: "Ramp 2 (Reserved)",
      eta: "~32 min",
      badge: "gold" as const,
      isUser: true,
      paymentStatus: "PENDING",
    },
    {
      token: "A143",
      farmer: "Kallu Ram",
      phone: "+91 98444 55667",
      crop: "Mustard",
      quantityKg: 850,
      slot: "10:30 AM – 11:00 AM",
      status: "SCHEDULED",
      statusLabel: "Scheduled",
      counter: "Waiting",
      eta: "~36 min",
      badge: "neutral" as const,
      paymentStatus: "PENDING",
    },
    {
      token: "A129",
      farmer: "Harishankar Yadav",
      phone: "+91 98555 66778",
      crop: "Paddy",
      quantityKg: 1500,
      slot: "09:30 AM – 10:00 AM",
      status: "COMPLETED",
      statusLabel: "Intake Completed",
      counter: "Counter 1",
      eta: "Completed",
      badge: "success" as const,
      paymentStatus: "PAID",
    },
  ]);

  const markArrived = (token: string) => {
    setQueueRows((prev) =>
      prev.map((r) =>
        r.token === token
          ? { ...r, status: "ARRIVED", statusLabel: "Arrived at Gate", badge: "warning" }
          : r
      )
    );
    showToast({
      title: "Farmer Marked Arrived",
      message: `Token ${token} checked in at security gate.`,
      type: "info",
    });
  };

  const assignCounter = (token: string) => {
    const counterName = `Counter ${Math.floor(1 + Math.random() * 4)}`;
    setQueueRows((prev) =>
      prev.map((r) =>
        r.token === token
          ? {
              ...r,
              status: "BEING_SERVED",
              statusLabel: "At Weighbridge",
              counter: counterName,
              badge: "success",
            }
          : r
      )
    );
    showToast({
      title: "Counter Assigned",
      message: `Token ${token} dispatched to ${counterName}.`,
      type: "success",
    });
  };

  const completeProcurement = (token: string) => {
    setQueueRows((prev) =>
      prev.map((r) =>
        r.token === token
          ? {
              ...r,
              status: "COMPLETED",
              statusLabel: "Intake Completed",
              eta: "Completed",
              badge: "success",
              paymentStatus: "PROCESSING",
            }
          : r
      )
    );
    showToast({
      title: "Procurement Completed",
      message: `Token ${token} produce weighed and voucher closed.`,
      type: "success",
    });
  };

  const updatePaymentStatus = (token: string) => {
    setQueueRows((prev) =>
      prev.map((r) =>
        r.token === token
          ? {
              ...r,
              paymentStatus: "PAID",
            }
          : r
      )
    );
    showToast({
      title: "DBT Payment Dispatched",
      message: `Token ${token} DBT payment status marked as PAID via PFMS.`,
      type: "success",
    });
  };

  const filteredRows = queueRows.filter((r) => {
    const matchesSearch =
      r.farmer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.token.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.crop.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "ALL" || r.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex flex-col gap-6 py-2">
      {/* Top Banner */}
      <section className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white shadow-xl overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-bold tracking-wide uppercase">
                Mandi Officer Portal
              </span>
              <span className="text-emerald-300 text-xs flex items-center gap-1">
                <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                Mandal Procurement Centre (Malihabad Mandi Samiti)
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              SMART PROCUREMENT CONTROL
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/80 mt-1 max-w-xl">
              Real-time gate dispatch, live counter assignment, weighing & quality certification, and direct benefit transfer processing.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/farmer/procurement">
              <GlassButton variant="primary" size="md" iconRight={<ArrowRight className="w-4 h-4" />}>
                Switch to Farmer Portal
              </GlassButton>
            </Link>
          </div>
        </div>
      </section>

      {/* 8 Core Procurement Admin Telemetry Indicators */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        <div className="p-3.5 rounded-2xl bg-white/70 dark:bg-[#0e1612]/70 backdrop-blur-xl border border-white/80 dark:border-white/10 text-center shadow-xs">
          <span className="text-[10px] uppercase text-foreground/50 font-bold block">Total Today</span>
          <span className="text-2xl font-black text-foreground mt-0.5 block">248</span>
          <span className="text-[10px] text-foreground/60">Farmers</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white/70 dark:bg-[#0e1612]/70 backdrop-blur-xl border border-white/80 dark:border-white/10 text-center shadow-xs">
          <span className="text-[10px] uppercase text-foreground/50 font-bold block">Scheduled</span>
          <span className="text-2xl font-black text-sky-700 dark:text-sky-400 mt-0.5 block">194</span>
          <span className="text-[10px] text-foreground/60">Slots Booked</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center shadow-xs">
          <span className="text-[10px] uppercase text-amber-900 dark:text-amber-200 font-bold block">Waiting</span>
          <span className="text-2xl font-black text-amber-700 dark:text-amber-300 mt-0.5 block">18</span>
          <span className="text-[10px] text-amber-900/70 dark:text-amber-200/70">In Queue</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center shadow-xs">
          <span className="text-[10px] uppercase text-emerald-900 dark:text-emerald-200 font-bold block">Serving</span>
          <span className="text-2xl font-black text-emerald-700 dark:text-emerald-300 mt-0.5 block">4</span>
          <span className="text-[10px] text-emerald-900/70 dark:text-emerald-200/70">At Counters</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white/70 dark:bg-[#0e1612]/70 backdrop-blur-xl border border-white/80 dark:border-white/10 text-center shadow-xs">
          <span className="text-[10px] uppercase text-foreground/50 font-bold block">Completed</span>
          <span className="text-2xl font-black text-emerald-700 dark:text-emerald-400 mt-0.5 block">172</span>
          <span className="text-[10px] text-foreground/60">Intakes Closed</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white/70 dark:bg-[#0e1612]/70 backdrop-blur-xl border border-white/80 dark:border-white/10 text-center shadow-xs">
          <span className="text-[10px] uppercase text-foreground/50 font-bold block">Active Counters</span>
          <span className="text-2xl font-black text-foreground mt-0.5 block">4 / 5</span>
          <span className="text-[10px] text-foreground/60">Weighbridges</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white/70 dark:bg-[#0e1612]/70 backdrop-blur-xl border border-white/80 dark:border-white/10 text-center shadow-xs">
          <span className="text-[10px] uppercase text-foreground/50 font-bold block">Avg Wait</span>
          <span className="text-2xl font-black text-emerald-700 dark:text-emerald-400 mt-0.5 block">32 min</span>
          <span className="text-[10px] text-foreground/60">Per Call</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white/70 dark:bg-[#0e1612]/70 backdrop-blur-xl border border-white/80 dark:border-white/10 text-center shadow-xs">
          <span className="text-[10px] uppercase text-foreground/50 font-bold block">Centre Load</span>
          <span className="text-2xl font-black text-foreground mt-0.5 block">78%</span>
          <span className="text-[10px] text-foreground/60">Intake Capacity</span>
        </div>
      </div>

      {/* Main Operational Live Queue Table Card */}
      <GlassCard className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-base font-bold text-foreground">
              Intake Gate & Counter Management Table
            </h3>
            <p className="text-xs text-foreground/55 mt-0.5">
              Live token queue stream. Update gate arrival, counter dispatch, and DBT voucher release.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search token, farmer or crop..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-56 text-xs px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="text-xs px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-foreground cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="BEING_SERVED">Being Served</option>
              <option value="CALLED">Called to Gate</option>
              <option value="ARRIVED">Arrived</option>
              <option value="SCHEDULED">Scheduled</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
        </div>

        <div className="w-full overflow-x-auto rounded-2xl border border-black/10 dark:border-white/10">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-black/5 dark:bg-white/5 border-b border-black/10 dark:border-white/10 text-foreground/60 uppercase font-semibold text-[10px]">
                <th className="py-3 px-3.5">Token</th>
                <th className="py-3 px-3.5">Farmer & Contact</th>
                <th className="py-3 px-3.5">Crop & Qty</th>
                <th className="py-3 px-3.5">Slot</th>
                <th className="py-3 px-3.5">Status</th>
                <th className="py-3 px-3.5">Counter</th>
                <th className="py-3 px-3.5">ETA</th>
                <th className="py-3 px-3.5">Payment</th>
                <th className="py-3 px-3.5 text-right">Officer Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 dark:divide-white/5">
              {filteredRows.map((row) => (
                <tr
                  key={row.token}
                  className={`hover:bg-black/5 dark:hover:bg-white/5 transition ${
                    row.isUser ? "bg-emerald-500/10 font-medium" : ""
                  }`}
                >
                  <td className="py-3 px-3.5 font-mono font-bold text-foreground">
                    {row.token}
                  </td>
                  <td className="py-3 px-3.5">
                    <div className="font-semibold text-foreground">{row.farmer}</div>
                    <div className="text-[10px] text-foreground/50 font-mono">{row.phone}</div>
                  </td>
                  <td className="py-3 px-3.5">
                    <div className="font-medium text-foreground">{row.crop}</div>
                    <div className="text-[10px] text-foreground/50">{row.quantityKg} kg</div>
                  </td>
                  <td className="py-3 px-3.5 text-foreground/70 font-mono text-[11px]">
                    {row.slot}
                  </td>
                  <td className="py-3 px-3.5">
                    <GlassBadge variant={row.badge} size="sm">
                      {row.statusLabel}
                    </GlassBadge>
                  </td>
                  <td className="py-3 px-3.5 font-medium text-foreground/80">
                    {row.counter}
                  </td>
                  <td className="py-3 px-3.5 font-bold text-emerald-700 dark:text-emerald-400">
                    {row.eta}
                  </td>
                  <td className="py-3 px-3.5">
                    <GlassBadge
                      variant={row.paymentStatus === "PAID" ? "success" : "warning"}
                      size="sm"
                    >
                      {row.paymentStatus}
                    </GlassBadge>
                  </td>
                  <td className="py-3 px-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {row.status === "SCHEDULED" && (
                        <button
                          onClick={() => markArrived(row.token)}
                          className="px-2 py-1 rounded-lg bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15 text-[10px] font-semibold text-foreground transition"
                        >
                          Mark Arrived
                        </button>
                      )}

                      {(row.status === "ARRIVED" || row.status === "CALLED") && (
                        <button
                          onClick={() => assignCounter(row.token)}
                          className="px-2 py-1 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-[10px] font-semibold transition"
                        >
                          Assign Counter
                        </button>
                      )}

                      {row.status === "BEING_SERVED" && (
                        <button
                          onClick={() => completeProcurement(row.token)}
                          className="px-2 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-semibold transition"
                        >
                          Complete Intake
                        </button>
                      )}

                      {row.status === "COMPLETED" && row.paymentStatus !== "PAID" && (
                        <button
                          onClick={() => updatePaymentStatus(row.token)}
                          className="px-2 py-1 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-[10px] font-semibold transition"
                        >
                          Release DBT
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
