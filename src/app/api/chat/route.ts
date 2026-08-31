import { NextRequest, NextResponse } from "next/server";
import { buildSystemPrompt, localAnswer } from "@/lib/chat";

type ChatMessage = { role: "user" | "assistant"; content: string };

/**
 * Chat endpoint.
 * - If OPENAI_API_KEY is set, uses OpenAI for natural AI replies.
 * - Otherwise falls back to a built-in rule-based responder (works offline / free).
 */
export async function POST(req: NextRequest) {
  try {
    const { messages } = (await req.json()) as { messages: ChatMessage[] };
    const lastUser = [...(messages || [])].reverse().find((m) => m.role === "user");
    const userText = lastUser?.content?.trim() || "";

    if (!userText) {
      return NextResponse.json({ reply: "Please type a question 🙂" });
    }

    const apiKey = process.env.OPENAI_API_KEY;

    // ---- Offline / free mode ----
    if (!apiKey) {
      return NextResponse.json({ reply: localAnswer(userText), mode: "local" });
    }

    // ---- AI mode (OpenAI) ----
    const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
    const trimmed = (messages || []).slice(-8); // keep recent context

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.5,
        max_tokens: 300,
        messages: [
          { role: "system", content: buildSystemPrompt() },
          ...trimmed.map((m) => ({ role: m.role, content: m.content })),
        ],
      }),
    });

    if (!res.ok) {
      // Fallback gracefully if OpenAI errors
      return NextResponse.json({ reply: localAnswer(userText), mode: "local-fallback" });
    }

    const data = await res.json();
    const reply =
      data?.choices?.[0]?.message?.content?.trim() || localAnswer(userText);

    return NextResponse.json({ reply, mode: "ai" });
  } catch (err) {
    console.error("Chat error:", err);
    return NextResponse.json(
      { reply: "Sorry, I had a hiccup. Please try again or WhatsApp us!" },
      { status: 200 }
    );
  }
}
