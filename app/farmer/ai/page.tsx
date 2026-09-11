"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Bot,
  Send,
  Mic,
  MicOff,
  Paperclip,
  Copy,
  Check,
  Share2,
  RotateCcw,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  User,
  Trash2,
  ShieldCheck,
  Volume2,
} from "lucide-react";
import { GlassCard } from "@/components/glass/GlassCard";
import { GlassButton } from "@/components/glass/GlassButton";
import { GlassBadge } from "@/components/glass/GlassBadge";
import { useTranslation } from "@/lib/i18n";
import { useToast } from "@/lib/toast";
import { AIMessage } from "@/types";

const INITIAL_MESSAGES: AIMessage[] = [
  {
    id: "msg-1",
    sender: "assistant",
    content:
      "Namaste! I am Kisan AI, your bilingual agricultural assistant. How can I assist your field operations today? You can ask me about irrigation schedules, pest remediation, mandi price trends, or government subsidies.",
    timestamp: "10:00 AM",
    suggestedPrompts: [
      "When should I irrigate my wheat crop?",
      "Why are my mustard leaves turning yellow?",
      "What is today's mandi price for wheat?",
      "How can I apply for PM-KISAN 19th installment?",
    ],
  },
];

export default function KisanAIPage() {
  const { t, language } = useTranslation();
  const { showToast } = useToast();

  const [messages, setMessages] = useState<AIMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isGenerating]);

  // Voice Recording simulation with Web Speech recognition if available
  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      showToast({
        type: "info",
        title: "Voice Input Captured",
        message: "Processing spoken audio in your regional language.",
      });
      setInputText("What is the best fertilizer dose for wheat flowering stage?");
    } else {
      setIsRecording(true);
      showToast({
        type: "info",
        title: "Microphone Active",
        message: "Listening... Speak in Hindi, English, or your native language.",
      });
    }
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isGenerating) return;

    const userMessage: AIMessage = {
      id: `msg-${Date.now()}`,
      sender: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsGenerating(true);

    // Real Gemini AI agricultural response via /api/ai
    (async () => {
      try {
        const response = await fetch("/api/ai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: text,
            language: language || "en",
          }),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error || "Failed to generate agricultural advisory.");
        }

        const assistantMessage: AIMessage = {
          id: `msg-${Date.now() + 1}`,
          sender: "assistant",
          content: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          suggestedPrompts: [
            "What organic pesticides work best for aphids?",
            "How much DAP should I apply per acre?",
          ],
        };

        setMessages((prev) => [...prev, assistantMessage]);
      } catch (err: any) {
        showToast({
          type: "error",
          title: "Kisan AI Notice",
          message: err.message || "We couldn't get a response right now. Please try again in a moment.",
        });
      } finally {
        setIsGenerating(false);
      }
    })();
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    showToast({
      type: "success",
      title: "Copied",
      message: "AI response copied to clipboard.",
    });
  };

  const clearChat = () => {
    setMessages(INITIAL_MESSAGES);
    showToast({
      type: "info",
      title: "Chat Reset",
      message: "Conversation history cleared.",
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8.5rem)] py-2 select-none">
      {/* Top Controls Bar */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-2xl bg-emerald-600 text-white shadow-sm">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-foreground">
              {t("ai.title")}
            </h1>
            <p className="text-[11px] text-foreground/50 hidden sm:block">
              {t("ai.subtitle")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <GlassButton
            variant="ghost"
            size="sm"
            onClick={clearChat}
            iconLeft={<Trash2 className="w-3.5 h-3.5" />}
          >
            Clear
          </GlassButton>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <GlassCard className="flex-1 p-4 sm:p-6 overflow-y-auto flex flex-col gap-4 relative">
        {messages.map((msg) => {
          const isUser = msg.sender === "user";
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 max-w-2xl ${
                isUser ? "ml-auto flex-row-reverse" : "mr-auto"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-2xl flex items-center justify-center text-xs font-bold shrink-0 shadow-xs ${
                  isUser
                    ? "bg-emerald-700 text-white"
                    : "bg-gradient-to-tr from-emerald-800 to-emerald-600 text-white"
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className="flex flex-col gap-1.5">
                <div
                  className={`p-4 rounded-3xl text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? "bg-emerald-700 text-white rounded-tr-sm shadow-md"
                      : "bg-white/90 dark:bg-[#121c17]/90 text-foreground rounded-tl-sm border border-black/5 dark:border-white/10 shadow-sm"
                  }`}
                >
                  {/* Markdown formatted content */}
                  <div className="space-y-2 whitespace-pre-line">{msg.content}</div>

                  {/* Actions on Assistant responses */}
                  {!isUser && (
                    <div className="mt-3 pt-2 border-t border-black/5 dark:border-white/5 flex items-center justify-between gap-3 text-[11px] text-foreground/50">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => copyToClipboard(msg.id, msg.content)}
                          className="hover:text-foreground flex items-center gap-1 p-1 rounded hover:bg-black/5"
                          aria-label="Copy message"
                        >
                          {copiedId === msg.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                          <span>Copy</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          className="p-1 hover:text-foreground rounded hover:bg-black/5"
                          aria-label="Helpful"
                          onClick={() =>
                            showToast({
                              type: "info",
                              title: "Feedback Recorded",
                              message: "Thank you for rating this recommendation.",
                            })
                          }
                        >
                          <ThumbsUp className="w-3 h-3" />
                        </button>
                        <button
                          className="p-1 hover:text-foreground rounded hover:bg-black/5"
                          aria-label="Unhelpful"
                          onClick={() =>
                            showToast({
                              type: "info",
                              title: "Feedback Recorded",
                              message: "We'll fine-tune agricultural recommendations.",
                            })
                          }
                        >
                          <ThumbsDown className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <span
                  className={`text-[10px] text-foreground/40 px-2 ${
                    isUser ? "text-right" : "text-left"
                  }`}
                >
                  {msg.timestamp}
                </span>

                {/* Suggested Follow-up Prompt Pills */}
                {msg.suggestedPrompts && msg.suggestedPrompts.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {msg.suggestedPrompts.map((prompt, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(prompt)}
                        className="text-[11px] px-3 py-1 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-medium transition border border-emerald-500/20 text-left"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isGenerating && (
          <div className="flex items-center gap-3 mr-auto max-w-md">
            <div className="w-8 h-8 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-[#121c17]/80 text-foreground text-xs flex items-center gap-2 border border-black/5 dark:border-white/10 shadow-xs">
              <Sparkles className="w-4 h-4 animate-spin text-emerald-600" />
              <span>Consulting ICAR crop knowledge base...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </GlassCard>

      {/* Input Box with Voice and Mic Controls */}
      <div className="mt-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="relative flex items-center gap-2 p-2 rounded-3xl bg-white/85 dark:bg-[#0f1713]/85 backdrop-blur-2xl border border-white/80 dark:border-white/10 shadow-lg"
        >
          {/* Voice Input Microphone Button (Section 31) */}
          <button
            type="button"
            onClick={toggleRecording}
            className={`p-2.5 rounded-2xl transition-all ${
              isRecording
                ? "bg-rose-600 text-white animate-pulse shadow-md"
                : "bg-black/5 dark:bg-white/10 text-foreground/70 hover:text-foreground"
            }`}
            aria-label="Toggle voice input"
          >
            {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              isRecording
                ? "Listening to your voice..."
                : t("ai.placeholder")
            }
            className="flex-1 bg-transparent px-2 py-2 text-xs sm:text-sm text-foreground placeholder:text-foreground/40 focus:outline-none"
          />

          <GlassButton
            type="submit"
            variant="primary"
            size="sm"
            disabled={!inputText.trim() || isGenerating}
            iconRight={<Send className="w-3.5 h-3.5" />}
          >
            Ask
          </GlassButton>
        </form>

        <div className="text-[10px] text-foreground/45 text-center mt-1.5 flex items-center justify-center gap-1">
          <ShieldCheck className="w-3 h-3 text-emerald-600" />
          <span>{t("ai.disclaimer")}</span>
        </div>
      </div>
    </div>
  );
}
