import { NextResponse } from "next/server";
import {
  HF_DEFAULT_MODEL,
  HF_MODELS,
  chatWithHuggingFace,
  isHfConfigured,
} from "@/lib/huggingface";

export const runtime = "nodejs";
export const maxDuration = 60;

type ChatBody = {
  message?: string;
  history?: { role: "user" | "assistant"; content: string }[];
  shopContext?: string;
  model?: string;
  /** Optional BYOK — used only if server has no HUGGINGFACE_API_KEY */
  apiKey?: string;
};

export async function GET() {
  return NextResponse.json({
    configured: isHfConfigured(),
    provider: "huggingface",
    defaultModel: HF_DEFAULT_MODEL,
    models: HF_MODELS,
  });
}

export async function POST(req: Request) {
  let body: ChatBody;
  try {
    body = (await req.json()) as ChatBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const message = body.message?.trim();
  if (!message) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }

  try {
    const reply = await chatWithHuggingFace({
      message,
      history: body.history?.slice(-8) ?? [],
      shopContext: body.shopContext ?? "",
      model: body.model,
      apiKey: body.apiKey,
    });
    return NextResponse.json({
      reply,
      provider: "huggingface",
      model: body.model || HF_DEFAULT_MODEL,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Hugging Face request failed";
    const status = /API key|token|configured/i.test(msg) ? 401 : 502;
    return NextResponse.json({ error: msg }, { status });
  }
}
