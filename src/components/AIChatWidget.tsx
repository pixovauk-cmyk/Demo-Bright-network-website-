"use client";

import { useState, useEffect, useRef } from "react";
import { X, Send, MessageCircle, Clock, Phone, Mail } from "lucide-react";

type Step = "closed" | "form" | "chat" | "ended";

interface Lead {
  name: string;
  email: string;
  company: string;
  consent: boolean;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

const MAX_USER_MESSAGES = 10;
const SESSION_SECONDS = 180; // 3 minutes

export default function AIChatWidget() {
  const [step, setStep] = useState<Step>("closed");
  const [lead, setLead] = useState<Lead>({ name: "", email: "", company: "", consent: false });
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(SESSION_SECONDS);
  const [userMsgCount, setUserMsgCount] = useState(0);
  const [formError, setFormError] = useState("");
  const [brevoContactId, setBrevoContactId] = useState<number | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Send chat transcript to Brevo when session ends
  useEffect(() => {
    if (step === "ended" && brevoContactId && messages.length > 1) {
      fetch("/api/leads/note", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contactId: brevoContactId, messages }),
      }).catch(console.error);
    }
  }, [step]); // eslint-disable-line react-hooks/exhaustive-deps

  // 3-minute session timer
  useEffect(() => {
    if (step === "chat") {
      timerRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            clearInterval(timerRef.current!);
            setStep("ended");
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [step]);

  // Focus input when chat opens
  useEffect(() => {
    if (step === "chat") {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [step]);

  function formatTime(s: number) {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  }

  function reset() {
    setStep("closed");
    setMessages([]);
    setInput("");
    setTimeLeft(SESSION_SECONDS);
    setUserMsgCount(0);
    setFormError("");
    setBrevoContactId(null);
    setLead({ name: "", email: "", company: "", consent: false });
    if (timerRef.current) clearInterval(timerRef.current);
  }

  async function handleFormSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    if (!lead.name.trim() || !lead.email.trim()) {
      setFormError("Please enter your name and email.");
      return;
    }
    if (!lead.consent) {
      setFormError("Please tick the consent box to continue.");
      return;
    }
    setFormError("");

    // Capture lead in Brevo — store contact ID for attaching chat note later
    fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: lead.name, email: lead.email, company: lead.company }),
    })
      .then((r) => r.json())
      .then((d) => { if (d.contactId) setBrevoContactId(d.contactId); })
      .catch(console.error);

    // Greet by name
    const greeting: Message = {
      role: "assistant",
      content: `Hi ${lead.name.split(" ")[0]}! I'm Alex from BrightPeak. Quick one — are you an employer looking to train your team, or are you exploring apprenticeships for yourself?`,
    };
    setMessages([greeting]);
    setStep("chat");
  }

  async function sendMessage(e?: { preventDefault(): void }) {
    e?.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    if (userMsgCount >= MAX_USER_MESSAGES) {
      setStep("ended");
      return;
    }

    const userMsg: Message = { role: "user", content: text };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    setLoading(true);
    setUserMsgCount((c) => c + 1);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updated.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok || !res.body) {
        throw new Error("No response");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let full = "";

      // Add empty assistant bubble
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        full += decoder.decode(value, { stream: true });
        setMessages((prev) => [
          ...prev.slice(0, -1),
          { role: "assistant", content: full },
        ]);
      }

      // Check if Alex signalled session end
      if (full.includes("[END_SESSION]")) {
        setMessages((prev) => [
          ...prev.slice(0, -1),
          { role: "assistant", content: full.replace("[END_SESSION]", "").trim() },
        ]);
        setTimeout(() => setStep("ended"), 2200);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry — something went wrong on my end. Please call us on 01246 918 340." },
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }

  const timerRed = timeLeft <= 30;
  const timerAmber = timeLeft <= 60 && !timerRed;
  const messagesLeft = MAX_USER_MESSAGES - userMsgCount;

  return (
    <>
      {/* ── Floating launcher button ── */}
      {step === "closed" && (
        <button
          onClick={() => setStep("form")}
          aria-label="Chat with Alex, BrightPeak AI Advisor"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-5 py-3.5 rounded-full text-white font-bold text-sm shadow-2xl transition-all duration-200 hover:scale-105 hover:shadow-sky-500/40 active:scale-95"
          style={{ background: "linear-gradient(135deg, #0EA5E9 0%, #0369A1 100%)", boxShadow: "0 8px 32px rgba(2,132,199,0.45)" }}
        >
          <MessageCircle style={{ width: 18, height: 18 }} />
          Ask Alex — AI Advisor
          {/* Online dot */}
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-white animate-pulse" aria-hidden />
        </button>
      )}

      {/* ── Chat panel ── */}
      {step !== "closed" && (
        <div
          className="fixed bottom-6 right-6 z-50 flex flex-col rounded-3xl shadow-2xl overflow-hidden border border-white/8"
          style={{ width: 385, maxHeight: 590, background: "#040B18" }}
        >
          {/* Header */}
          <div
            className="flex items-center gap-3 px-5 py-4 flex-shrink-0 border-b border-white/8"
            style={{ background: "linear-gradient(135deg, #0284C7 0%, #023E6B 100%)" }}
          >
            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center font-black text-white text-sm">
                A
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#0284C7]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-white text-sm leading-tight">Alex</div>
              <div className="text-white/55 text-[11px]">BrightPeak AI Advisor · Typically instant</div>
            </div>
            {step === "chat" && (
              <>
                <div className={`flex items-center gap-1 text-xs font-bold transition-colors ${timerRed ? "text-red-400" : timerAmber ? "text-amber-400" : "text-white/50"}`}>
                  <Clock style={{ width: 12, height: 12 }} />
                  {formatTime(timeLeft)}
                </div>
                <button
                  onClick={() => setStep("ended")}
                  className="text-[11px] font-semibold text-white/35 hover:text-white/70 border border-white/15 hover:border-white/35 px-2.5 py-1 rounded-lg transition-all"
                >
                  End
                </button>
              </>
            )}
            <button onClick={reset} aria-label="Close chat" className="text-white/40 hover:text-white transition-colors ml-1 p-1">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* ── Step: Lead capture form ── */}
          {step === "form" && (
            <form onSubmit={handleFormSubmit} className="flex flex-col gap-3.5 p-5 overflow-y-auto">
              <div className="space-y-1">
                <p className="text-white font-bold text-base">Hi there! 👋</p>
                <p className="text-white/45 text-xs leading-relaxed">
                  I&apos;m Alex, BrightPeak&apos;s AI apprenticeship advisor. Before we start, quick question — who am I speaking with?
                </p>
              </div>

              <input
                required
                autoFocus
                placeholder="Your full name *"
                value={lead.name}
                onChange={(e) => setLead({ ...lead, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl text-sm bg-white/8 border border-white/10 text-white placeholder-white/25 focus:outline-none focus:border-sky-400/50 transition-colors"
              />
              <input
                required
                type="email"
                placeholder="Work email address *"
                value={lead.email}
                onChange={(e) => setLead({ ...lead, email: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl text-sm bg-white/8 border border-white/10 text-white placeholder-white/25 focus:outline-none focus:border-sky-400/50 transition-colors"
              />
              <input
                placeholder="Company name (optional)"
                value={lead.company}
                onChange={(e) => setLead({ ...lead, company: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl text-sm bg-white/8 border border-white/10 text-white placeholder-white/25 focus:outline-none focus:border-sky-400/50 transition-colors"
              />

              <label className="flex items-start gap-3 cursor-pointer group mt-0.5">
                <input
                  type="checkbox"
                  checked={lead.consent}
                  onChange={(e) => setLead({ ...lead, consent: e.target.checked })}
                  className="mt-0.5 w-4 h-4 flex-shrink-0 accent-sky-400"
                />
                <span className="text-white/35 text-[11px] leading-relaxed group-hover:text-white/55 transition-colors">
                  I consent to BrightPeak Group contacting me regarding apprenticeship programmes. I can withdraw consent at any time.
                </span>
              </label>

              {formError && (
                <p className="text-red-400 text-xs font-medium">{formError}</p>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl text-white font-bold text-sm transition-all hover:opacity-90 active:scale-[0.98] mt-0.5"
                style={{ background: "linear-gradient(135deg, #0EA5E9 0%, #0369A1 100%)" }}
              >
                Start Chat with Alex →
              </button>

              <p className="text-white/20 text-[10px] text-center">
                Session limited to 3 minutes · GDPR compliant · No spam
              </p>
            </form>
          )}

          {/* ── Step: Active chat ── */}
          {step === "chat" && (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0" style={{ maxHeight: 380 }}>
                {messages.map((m, i) => (
                  <div key={i} className={`flex items-end gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                    {m.role === "assistant" && (
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-black flex-shrink-0 mb-0.5" style={{ background: "linear-gradient(135deg, #0EA5E9 0%, #0369A1 100%)" }}>
                        A
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] px-4 py-2.5 text-sm leading-relaxed ${
                        m.role === "user"
                          ? "text-white rounded-2xl rounded-br-sm"
                          : "text-white/80 bg-white/7 border border-white/8 rounded-2xl rounded-bl-sm"
                      }`}
                      style={m.role === "user" ? { background: "linear-gradient(135deg, #0EA5E9 0%, #0369A1 100%)" } : {}}
                    >
                      {m.content || <span className="opacity-0">_</span>}
                    </div>
                  </div>
                ))}

                {/* Typing indicator */}
                {loading && (
                  <div className="flex items-end gap-2 justify-start">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-black flex-shrink-0" style={{ background: "linear-gradient(135deg, #0EA5E9 0%, #0369A1 100%)" }}>
                      A
                    </div>
                    <div className="bg-white/7 border border-white/8 rounded-2xl rounded-bl-sm px-4 py-3">
                      <div className="flex gap-1 items-center h-4">
                        {[0, 1, 2].map((i) => (
                          <span
                            key={i}
                            className="w-1.5 h-1.5 rounded-full bg-white/35 animate-bounce"
                            style={{ animationDelay: `${i * 0.18}s` }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Low messages warning */}
              {messagesLeft <= 2 && messagesLeft > 0 && (
                <div className="px-4 py-1.5 text-center text-amber-400 text-[11px] font-semibold border-t border-white/5 flex-shrink-0">
                  {messagesLeft} message{messagesLeft !== 1 ? "s" : ""} left in session
                </div>
              )}

              {/* Input bar */}
              <form onSubmit={sendMessage} className="flex gap-2 p-3 border-t border-white/8 flex-shrink-0">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                  placeholder="Ask about programmes, funding..."
                  disabled={loading}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm bg-white/8 border border-white/10 text-white placeholder-white/25 focus:outline-none focus:border-sky-400/50 transition-colors disabled:opacity-40"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white transition-all disabled:opacity-25 hover:opacity-90 active:scale-95 flex-shrink-0"
                  style={{ background: "linear-gradient(135deg, #0EA5E9 0%, #0369A1 100%)" }}
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          )}

          {/* ── Step: Session ended ── */}
          {step === "ended" && (
            <div className="flex flex-col items-center justify-center gap-5 p-8 text-center flex-1">
              <div
                className="w-14 h-14 rounded-2xl border border-sky-500/25 flex items-center justify-center text-white font-black text-xl"
                style={{ background: "rgba(2,132,199,0.15)" }}
              >
                A
              </div>
              <div>
                <p className="text-white font-bold text-base mb-2">
                  {timeLeft === 0 ? "Session time's up!" : "Thanks for chatting!"}
                </p>
                <p className="text-white/45 text-sm leading-relaxed max-w-[280px]">
                  Ready to take the next step? Book a free 30-minute discovery call — no commitment, no hard sell.
                </p>
              </div>

              <a
                href="https://apps.brightpeakgroup.com/book.html"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl text-white font-bold text-sm text-center transition-all hover:opacity-90 active:scale-[0.98]"
                style={{ background: "linear-gradient(135deg, #0EA5E9 0%, #0369A1 100%)" }}
              >
                Book Free Call →
              </a>

              <div className="flex gap-5">
                <a
                  href="tel:01246918340"
                  className="flex items-center gap-1.5 text-white/35 text-xs hover:text-white/65 transition-colors"
                >
                  <Phone style={{ width: 12, height: 12 }} /> 01246 918 340
                </a>
                <a
                  href="mailto:contact@brightpeakgroup.com"
                  className="flex items-center gap-1.5 text-white/35 text-xs hover:text-white/65 transition-colors"
                >
                  <Mail style={{ width: 12, height: 12 }} /> Email us
                </a>
              </div>

              <button onClick={reset} className="text-white/20 text-xs hover:text-white/45 transition-colors">
                Close
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
