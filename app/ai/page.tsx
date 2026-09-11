"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Bot,
  Send,
  Sparkles,
  User,
  Trash2,
  Copy,
  Check,
  RotateCcw,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Settings2,
  Sprout,
  ArrowLeft,
  Globe,
  CheckCircle2,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { GlassCard } from "@/components/glass/GlassCard";
import { GlassButton } from "@/components/glass/GlassButton";
import { GlassBadge } from "@/components/glass/GlassBadge";
import { HomeNavbar } from "@/components/home/HomeNavbar";
import { LANGUAGE_NAME_MAP, FarmerContext } from "@/lib/ai/prompts";

interface Message {
  id: string;
  role: "user" | "model";
  text: string;
  timestamp: string;
  languageUsed?: string;
}

const EXAMPLE_QUESTIONS = [
  "How can I improve my soil?",
  "What should I do if my crop leaves are turning yellow?",
  "How often should I irrigate my crop?",
  "What precautions should I take before applying fertilizer?",
];

const INITIAL_GREETING: Message = {
  id: "greeting",
  role: "model",
  text: "Namaste! I am Kisan AI, your agricultural advisory assistant. How can I assist with your crops, soil management, irrigation, or pest prevention today?",
  timestamp: "Just now",
};

export default function KisanAITestPage() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_GREETING]);
  const [inputMessage, setInputMessage] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showContextDrawer, setShowContextDrawer] = useState(false);

  // Optional Farm Context
  const [context, setContext] = useState<FarmerContext>({
    crop: "",
    cropStage: "",
    location: "",
    soilType: "",
    irrigationType: "",
  });

  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend !== undefined ? textToSend : inputMessage).trim();
    if (!text || isLoading) return;

    setErrorMessage(null);

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (textToSend === undefined) {
      setInputMessage("");
    }
    setIsLoading(true);

    try {
      // Build conversation history for multi-turn context (excluding initial greeting)
      const conversationHistory = messages
        .filter((m) => m.id !== "greeting")
        .map((m) => ({
          role: m.role,
          parts: m.text,
        }));

      // Filter non-empty context fields
      const activeContext: FarmerContext = Object.fromEntries(
        Object.entries(context).filter(([_, v]) => v !== undefined && v !== "")
      );

      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,
          language: selectedLanguage,
          context: Object.keys(activeContext).length > 0 ? activeContext : undefined,
          conversationHistory,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to receive response from Kisan AI.");
      }

      const modelMessage: Message = {
        id: `model-${Date.now()}`,
        role: "model",
        text: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        languageUsed: data.language,
      };

      setMessages((prev) => [...prev, modelMessage]);
    } catch (err: any) {
      console.error("Kisan AI fetch error:", err);
      setErrorMessage(
        err.message || "We couldn't get a response right now. Please try again in a moment."
      );
    } finally {
      setIsLoading(false);
      // Re-focus input on desktop
      if (window.innerWidth > 768) {
        setTimeout(() => inputRef.current?.focus(), 100);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearConversation = () => {
    setMessages([INITIAL_GREETING]);
    setErrorMessage(null);
  };

  return (
    <div className="w-full min-h-[100dvh] flex flex-col bg-background text-foreground">
      {/* Navigation Header */}
      <HomeNavbar />

      {/* Main Container */}
      <main className="flex-1 w-full max-w-[1400px] mx-auto pt-24 sm:pt-28 pb-6 px-3 sm:px-6 lg:px-8 flex flex-col">
        {/* Page Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-4 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-800 via-emerald-700 to-emerald-600 text-white flex items-center justify-center shadow-[0_4px_14px_rgba(21,128,61,0.25)] shrink-0">
              <Bot className="w-6 h-6 text-emerald-100" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
                  Kisan AI
                </h1>
                <GlassBadge variant="success" size="sm" className="hidden sm:inline-flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Gemini Flash 1.5
                </GlassBadge>
              </div>
              <p className="text-xs sm:text-sm text-foreground/70 line-clamp-1">
                Direct agronomic guidance & crop care intelligence powered by Google Gemini.
              </p>
            </div>
          </div>

          {/* Top Controls: Language Selector, Farm Context Toggle, Clear Chat */}
          <div className="flex items-center flex-wrap gap-2 sm:gap-2.5">
            {/* Language Selector */}
            <div className="relative flex items-center">
              <label htmlFor="ai-language-select" className="sr-only">Select response language</label>
              <Globe className="w-4 h-4 absolute left-3 text-emerald-600 dark:text-emerald-400 pointer-events-none" />
              <select
                id="ai-language-select"
                value={selectedLanguage}
                aria-label="Select AI response language"
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="pl-9 pr-8 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white/80 dark:bg-white/5 border border-border/70 hover:border-emerald-500/60 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all text-foreground cursor-pointer appearance-none shadow-sm"
              >
                {Object.entries(LANGUAGE_NAME_MAP).map(([code, name]) => (
                  <option key={code} value={code} className="bg-white dark:bg-zinc-900 text-foreground">
                    {name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 text-foreground/50 pointer-events-none" />
            </div>

            {/* Farm Context Toggle */}
            <button
              onClick={() => setShowContextDrawer((prev) => !prev)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition-all ${
                showContextDrawer
                  ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                  : "bg-white/80 dark:bg-white/5 text-foreground/80 border-border/70 hover:border-emerald-500/50"
              }`}
            >
              <Settings2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Farm Context</span>
              <span className="sm:hidden">Context</span>
              {showContextDrawer ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>

            {/* Clear Conversation */}
            <GlassButton
              variant="outline"
              size="sm"
              onClick={handleClearConversation}
              className="gap-1.5 text-xs text-foreground/80 hover:text-red-600"
              title="Clear conversation"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Clear Chat</span>
            </GlassButton>
          </div>
        </div>

        {/* Optional Farm Context Expansion Panel */}
        {showContextDrawer && (
          <div className="mb-4 p-4 rounded-2xl bg-white/90 dark:bg-white/[0.03] border border-emerald-500/30 backdrop-blur-xl shadow-sm animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sprout className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-xs sm:text-sm font-bold text-foreground">
                  Active Farm Profile (Sent to Gemini for personalized advice)
                </h3>
              </div>
              <span className="text-[11px] text-foreground/50">Optional agricultural parameters</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
              <div>
                <label className="block text-[11px] font-semibold text-foreground/70 mb-1">
                  Primary Crop
                </label>
                <input
                  type="text"
                  placeholder="e.g. Rice, Wheat, Cotton"
                  value={context.crop || ""}
                  onChange={(e) => setContext({ ...context, crop: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-border/70 bg-white/70 dark:bg-white/5 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-foreground/70 mb-1">
                  Growth Stage
                </label>
                <input
                  type="text"
                  placeholder="e.g. Vegetative, Flowering"
                  value={context.cropStage || ""}
                  onChange={(e) => setContext({ ...context, cropStage: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-border/70 bg-white/70 dark:bg-white/5 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-foreground/70 mb-1">
                  Location / District
                </label>
                <input
                  type="text"
                  placeholder="e.g. Guntur, AP"
                  value={context.location || ""}
                  onChange={(e) => setContext({ ...context, location: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-border/70 bg-white/70 dark:bg-white/5 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-foreground/70 mb-1">
                  Soil Type
                </label>
                <input
                  type="text"
                  placeholder="e.g. Black Cotton, Red Loam"
                  value={context.soilType || ""}
                  onChange={(e) => setContext({ ...context, soilType: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-border/70 bg-white/70 dark:bg-white/5 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-foreground/70 mb-1">
                  Irrigation
                </label>
                <input
                  type="text"
                  placeholder="e.g. Drip, Canal, Borewell"
                  value={context.irrigationType || ""}
                  onChange={(e) => setContext({ ...context, irrigationType: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-border/70 bg-white/70 dark:bg-white/5 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Conversation Area */}
        <div className="flex-1 min-h-[380px] max-h-[60vh] overflow-y-auto rounded-3xl bg-white/60 dark:bg-[#0c1410]/50 backdrop-blur-xl border border-white/80 dark:border-white/10 shadow-[0_8px_32px_rgba(18,32,23,0.04)] p-4 sm:p-6 flex flex-col gap-4">
          {messages.map((message) => {
            const isUser = message.role === "user";
            return (
              <div
                key={message.id}
                className={`flex gap-3 max-w-[88%] sm:max-w-[78%] ${
                  isUser ? "ml-auto flex-row-reverse" : "mr-auto"
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                    isUser
                      ? "bg-emerald-600 text-white"
                      : "bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20"
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
                <div
                  className={`flex flex-col gap-1.5 rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed shadow-sm transition-all ${
                    isUser
                      ? "bg-gradient-to-tr from-emerald-800 via-emerald-700 to-emerald-600 text-white rounded-tr-none"
                      : "bg-white/95 dark:bg-white/[0.04] text-foreground border border-border/60 rounded-tl-none"
                  }`}
                >
                  <div className="whitespace-pre-wrap break-words">{message.text}</div>

                  {/* Bubble Footer */}
                  <div
                    className={`flex items-center justify-between gap-3 text-[10px] mt-1 pt-1 border-t ${
                      isUser ? "border-white/20 text-emerald-100" : "border-border/40 text-foreground/50"
                    }`}
                  >
                    <span>{message.timestamp}</span>

                    {!isUser && message.id !== "greeting" && (
                      <button
                        onClick={() => copyToClipboard(message.id, message.text)}
                        className="flex items-center gap-1 hover:text-foreground transition-colors p-0.5 rounded"
                        title="Copy text"
                      >
                        {copiedId === message.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span className="text-emerald-600 font-semibold">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex gap-3 max-w-[85%] mr-auto items-center animate-in fade-in duration-200">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20 flex items-center justify-center shrink-0">
                <Loader2 className="w-4 h-4 animate-spin text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="rounded-2xl rounded-tl-none px-4 py-3 bg-white/90 dark:bg-white/[0.04] border border-border/60 shadow-sm flex items-center gap-2 text-xs sm:text-sm text-foreground/75">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>Kisan AI is analyzing your agricultural question...</span>
              </div>
            </div>
          )}

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3 sm:p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-700 dark:text-red-400 text-xs sm:text-sm flex items-start gap-2.5 shadow-sm">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
              <div className="flex-1">
                <p className="font-semibold">{errorMessage}</p>
                <p className="text-[11px] opacity-80 mt-0.5">
                  Check that your server has a valid <code className="font-mono bg-red-500/20 px-1 py-0.5 rounded">GEMINI_API_KEY</code> configured in <code className="font-mono bg-red-500/20 px-1 py-0.5 rounded">.env.local</code>.
                </p>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Example Questions Carousel / Pills */}
        <div className="mt-3 mb-2 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-bold text-foreground/60 uppercase tracking-wider shrink-0 flex items-center gap-1">
            <HelpCircle className="w-3 h-3 text-emerald-600" />
            Examples:
          </span>
          {EXAMPLE_QUESTIONS.map((q) => (
            <button
              key={q}
              onClick={() => handleSendMessage(q)}
              disabled={isLoading}
              className="text-xs px-3 py-1.5 rounded-full bg-white/80 dark:bg-white/5 border border-border/70 hover:border-emerald-500/60 hover:bg-emerald-500/10 text-foreground/80 hover:text-emerald-700 dark:hover:text-emerald-300 whitespace-nowrap transition-all shadow-xs disabled:opacity-50 disabled:pointer-events-none"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="relative mt-1">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-end gap-2 p-2 sm:p-2.5 rounded-2xl sm:rounded-3xl bg-white/90 dark:bg-[#0c1410]/85 backdrop-blur-2xl border border-white/90 dark:border-white/10 shadow-[0_8px_24px_rgba(18,32,23,0.06)]"
          >
            <label htmlFor="ai-chat-input" className="sr-only">Ask Kisan AI a farming question</label>
            <textarea
              id="ai-chat-input"
              ref={inputRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              placeholder="Ask anything about crops, soil health, irrigation timing, or pest control... (Press Enter to send)"
              rows={1}
              className="flex-1 max-h-32 min-h-[44px] px-3 py-2.5 bg-transparent text-xs sm:text-sm text-foreground placeholder:text-foreground/45 focus:outline-none resize-none disabled:opacity-50"
            />

            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="h-11 px-4 sm:px-5 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-emerald-800 via-emerald-700 to-emerald-600 text-white font-bold flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(21,128,61,0.25)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-40 disabled:pointer-events-none disabled:scale-100"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span className="hidden sm:inline text-xs sm:text-sm">Send</span>
                  <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Security & Agronomic Disclaimer Notice */}
          <div className="flex items-center justify-center gap-2 mt-2 text-[11px] text-foreground/50 text-center">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>
              Server-side Gemini 1.5 Flash verification. AI suggestions do not replace local agronomic laboratory tests.
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
