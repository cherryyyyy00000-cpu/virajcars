"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import { SITE } from "@/lib/site";

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "Cheapest car?",
  "7-seater for family",
  "Car for wedding",
  "How to book?",
  "Documents needed?",
];

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content: `Namaste! 🙏 I'm Viraj Assistant. Ask me about cars, prices, or booking at ${SITE.name}.`,
    },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading, open]);

  async function send(text: string) {
    const content = text.trim();
    if (!content || loading) return;
    const next = [...messages, { role: "user" as const, content }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      setMessages((m) => [...m, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Network issue — please try again or WhatsApp us!" },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Launcher */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Open chat assistant"
        className="fixed bottom-24 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-brand-gradient text-ink shadow-brand-lg transition-transform hover:scale-110"
      >
        {open ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed bottom-40 right-5 z-50 flex h-[70vh] max-h-[560px] w-[calc(100vw-2.5rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-brand/20 bg-ink-soft shadow-card">
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-ink-line bg-ink-card px-4 py-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-gradient text-sm font-bold text-ink">
              VR
            </div>
            <div>
              <p className="text-sm font-semibold">Viraj Assistant</p>
              <p className="flex items-center gap-1 text-[11px] text-green-400">
                <span className="h-1.5 w-1.5 rounded-full bg-green-400" /> Online now
              </p>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "rounded-br-sm bg-brand-gradient text-ink"
                      : "rounded-bl-sm border border-ink-line bg-ink-card text-foreground/85"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-2xl rounded-bl-sm border border-ink-line bg-ink-card px-3.5 py-2.5 text-sm text-foreground/50">
                  <Loader2 size={14} className="animate-spin" /> typing…
                </div>
              </div>
            )}
          </div>

          {/* Suggestions */}
          {messages.length <= 1 && (
            <div className="flex flex-wrap gap-2 px-4 pb-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="rounded-full border border-brand/30 px-3 py-1 text-xs text-brand-light transition-colors hover:bg-brand/10"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2 border-t border-ink-line p-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about cars, prices…"
              className="flex-1 rounded-full border border-ink-line bg-ink px-4 py-2.5 text-sm outline-none focus:border-brand"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-gradient text-ink transition-transform hover:scale-105 disabled:opacity-40"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
