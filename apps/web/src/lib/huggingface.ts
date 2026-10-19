export const HF_ROUTER_URL = (
  process.env.HUGGINGFACE_BASE_URL || "https://router.huggingface.co/v1"
).replace(/\/$/, "");

export const HF_DEFAULT_MODEL =
  process.env.HUGGINGFACE_MODEL || "deepseek-ai/DeepSeek-V3-0324";

export const HF_MODELS = [
  {
    id: "deepseek-ai/DeepSeek-V3-0324",
    label: "DeepSeek V3 (best reasoning, free via HF)",
  },
  {
    id: "Qwen/Qwen2.5-Coder-7B-Instruct",
    label: "Qwen 2.5 Coder 7B (fast)",
  },
  {
    id: "Qwen/Qwen2.5-Coder-32B-Instruct",
    label: "Qwen 2.5 Coder 32B",
  },
  {
    id: "meta-llama/Llama-3.3-70B-Instruct",
    label: "Llama 3.3 70B",
  },
] as const;

const SYSTEM_PROMPT = `You are VYOMAI, an AI business co-pilot for shopkeepers and growing businesses.
You help with inventory, pricing, revenue, profit, reorder decisions, dead stock, and credit (udhaar) risk.

Rules:
- Be concise and practical. Prefer short bullets and clear next actions.
- Use ONLY the shop data provided in context. If something is missing, say what to log in VYOMAI.
- Speak in plain language suitable for small-business owners. INR amounts are in rupees.
- Do not invent SKUs, sales, or customers that are not in the context.
- When recommending price changes, show rough margin impact.`;

export function isHfConfigured(clientKey?: string): boolean {
  return Boolean(
    (process.env.HUGGINGFACE_API_KEY || "").trim() || (clientKey || "").trim()
  );
}

export async function chatWithHuggingFace(opts: {
  message: string;
  history?: { role: "user" | "assistant"; content: string }[];
  shopContext?: string;
  model?: string;
  apiKey?: string;
}): Promise<string> {
  const key = (
    process.env.HUGGINGFACE_API_KEY ||
    opts.apiKey ||
    ""
  ).trim();

  if (!key) {
    throw new Error(
      "Hugging Face is not configured. Add HUGGINGFACE_API_KEY in apps/web/.env.local (free token from https://huggingface.co/settings/tokens — enable Inference)."
    );
  }

  const model = opts.model?.trim() || HF_DEFAULT_MODEL;
  const messages: { role: string; content: string }[] = [
    { role: "system", content: SYSTEM_PROMPT },
  ];

  if (opts.shopContext?.trim()) {
    messages.push({
      role: "system",
      content: `Live shop context for this business:\n${opts.shopContext.trim()}`,
    });
  }

  for (const turn of opts.history ?? []) {
    if (!turn.content?.trim()) continue;
    messages.push({
      role: turn.role === "assistant" ? "assistant" : "user",
      content: turn.content.trim(),
    });
  }

  messages.push({ role: "user", content: opts.message.trim() });

  const res = await fetch(`${HF_ROUTER_URL}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.35,
      max_tokens: 1024,
    }),
  });

  if (res.status === 503) {
    throw new Error("Model is loading on Hugging Face — retry in a few seconds.");
  }
  if (res.status === 401) {
    throw new Error("Invalid Hugging Face token. Check HUGGINGFACE_API_KEY.");
  }
  if (res.status === 403) {
    throw new Error(
      "Hugging Face token needs Inference Providers permission. Create a new token at huggingface.co/settings/tokens."
    );
  }
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(
      errText.slice(0, 280) || `Hugging Face error ${res.status}`
    );
  }

  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const text = data?.choices?.[0]?.message?.content?.trim();
  if (!text) {
    throw new Error("Hugging Face returned an empty response.");
  }
  return text;
}
