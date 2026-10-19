"use client";

import { useEffect, useRef, useState } from "react";
import { buildShopContext } from "@/lib/shop-context-prompt";
import { useShop } from "@/lib/shop-context";

type Msg = { role: "user" | "assistant"; content: string };

type HfStatus = {
  configured: boolean;
  defaultModel: string;
  models: { id: string; label: string }[];
};

const KEY_STORAGE = "vyomai.hf.apiKey";
const MODEL_STORAGE = "vyomai.hf.model";

const SUGGESTIONS = [
  "What should I reorder this week?",
  "Which products hurt my margin?",
  "Summarize my profit and dead stock",
  "Who is risky on credit?",
];

type AgentChatProps = {
  variant?: "embedded" | "drawer";
  onClose?: () => void;
};

export function AgentChat({ variant = "embedded", onClose }: AgentChatProps) {
  const { store, alerts, summary, ready } = useShop();
  const [status, setStatus] = useState<HfStatus | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    try {
      setApiKey(localStorage.getItem(KEY_STORAGE) || "");
      setModel(localStorage.getItem(MODEL_STORAGE) || "");
    } catch {
      /* ignore */
    }
    fetch("/api/agent/chat")
      .then((r) => r.json())
      .then((data: HfStatus) => {
        setStatus(data);
        setModel((prev) => prev || data.defaultModel);
      })
      .catch(() =>
        setStatus({
          configured: false,
          defaultModel: "Qwen/Qwen2.5-Coder-7B-Instruct",
          models: [],
        })
      );
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (variant === "drawer") {
      inputRef.current?.focus();
    }
  }, [variant]);

  const canChat = Boolean(status?.configured || apiKey.trim());
  const isDrawer = variant === "drawer";

  async function send(text: string) {
    const prompt = text.trim();
    if (!prompt || loading || !ready) return;

    setError(null);
    setInput("");
    const nextHistory = [...messages, { role: "user" as const, content: prompt }];
    setMessages(nextHistory);
    setLoading(true);

    try {
      const res = await fetch("/api/agent/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: prompt,
          history: messages,
          shopContext: buildShopContext({ store, alerts, summary }),
          model: model || status?.defaultModel,
          apiKey: apiKey.trim() || undefined,
        }),
      });
      const data = (await res.json()) as { reply?: string; error?: string };
      if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
      setMessages([
        ...nextHistory,
        { role: "assistant", content: data.reply || "No reply." },
      ]);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Chat failed";
      setError(msg);
      setMessages(nextHistory);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  function saveSettings() {
    try {
      localStorage.setItem(KEY_STORAGE, apiKey.trim());
      localStorage.setItem(MODEL_STORAGE, model);
    } catch {
      /* ignore */
    }
    setShowSettings(false);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void send(input);
    }
  }

  return (
    <div
      className={`flex flex-col overflow-hidden bg-white ${
        isDrawer ? "h-full" : "vyom-panel min-h-[420px]"
      }`}
    >
      <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3.5 sm:px-5">
        <div className="min-w-0">
          <h2
            className="truncate text-lg font-semibold text-ink"
            style={{ fontFamily: "var(--font-display)" }}
          >
            VYOMAI Chat
          </h2>
          <p className="truncate text-xs text-ink-soft">
            Ask about stock, pricing, profit & credit
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <button
            type="button"
            className="rounded-full px-3 py-1.5 text-sm text-ink-soft hover:bg-paper"
            onClick={() => setShowSettings((v) => !v)}
          >
            {showSettings ? "Done" : "Settings"}
          </button>
          {messages.length > 0 ? (
            <button
              type="button"
              className="rounded-full px-3 py-1.5 text-sm text-ink-soft hover:bg-paper"
              onClick={() => {
                setMessages([]);
                setError(null);
              }}
            >
              New
            </button>
          ) : null}
          {isDrawer && onClose ? (
            <button
              type="button"
              aria-label="Close chat"
              className="flex h-9 w-9 items-center justify-center rounded-full text-ink-soft hover:bg-paper hover:text-ink"
              onClick={onClose}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          ) : null}
        </div>
      </div>

      {showSettings ? (
        <div className="space-y-3 border-b border-line bg-paper/60 px-4 py-4 sm:px-5">
          <p className="text-sm text-ink-soft">
            Uses free Hugging Face LLM. Server key is preferred; optional
            browser token works for local testing.
          </p>
          <label className="block text-sm text-ink-soft">
            Hugging Face token
            <input
              className="vyom-input mt-1 font-mono text-sm"
              type="password"
              placeholder="hf_..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              autoComplete="off"
            />
          </label>
          <label className="block text-sm text-ink-soft">
            Model
            <select
              className="vyom-input mt-1"
              value={model}
              onChange={(e) => setModel(e.target.value)}
            >
              {(status?.models?.length
                ? status.models
                : [{ id: model, label: model }]
              ).map((m) => (
                <option key={m.id} value={m.id}>
                  {m.label}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            className="vyom-btn vyom-btn-primary !py-2"
            onClick={saveSettings}
          >
            Save settings
          </button>
        </div>
      ) : null}

      <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-4 sm:px-5">
        {messages.length === 0 ? (
          <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-5 py-6 text-center">
            <div>
              <div
                className="text-2xl font-semibold text-ink"
                style={{ fontFamily: "var(--font-display)" }}
              >
                How can I help?
              </div>
              <p className="mt-2 text-sm text-ink-soft">
                Chat about your live shop data — inventory, margins, reorder,
                and credit risk.
              </p>
            </div>
            <div className="grid gap-2 text-left">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  className="rounded-2xl border border-line bg-paper/70 px-3.5 py-3 text-sm text-ink transition hover:border-teal hover:bg-white"
                  onClick={() => send(s)}
                  disabled={!canChat || loading}
                >
                  {s}
                </button>
              ))}
            </div>
            {!canChat ? (
              <p className="rounded-xl border border-amber/30 bg-amber/5 px-3 py-2 text-left text-sm text-amber">
                Add a Hugging Face token in Settings to start chatting.
              </p>
            ) : null}
          </div>
        ) : (
          <div className="mx-auto flex w-full max-w-2xl flex-col gap-3">
            {messages.map((m, i) => (
              <div
                key={`${m.role}-${i}`}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[90%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                    m.role === "user"
                      ? "rounded-br-md bg-teal text-white"
                      : "rounded-bl-md border border-line bg-paper text-ink"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
          </div>
        )}
        {loading ? (
          <div className="mx-auto w-full max-w-2xl">
            <div className="animate-pulse-soft w-fit rounded-2xl border border-line bg-paper px-3.5 py-2.5 text-sm text-ink-soft">
              Thinking…
            </div>
          </div>
        ) : null}
        {error ? (
          <p className="mx-auto w-full max-w-2xl text-sm text-loss">{error}</p>
        ) : null}
        <div ref={bottomRef} />
      </div>

      <form
        className="border-t border-line bg-white p-3 sm:p-4"
        onSubmit={(e) => {
          e.preventDefault();
          void send(input);
        }}
      >
        <div className="mx-auto flex max-w-2xl items-end gap-2 rounded-2xl border border-line bg-paper/50 p-2 shadow-sm focus-within:border-teal">
          <textarea
            ref={inputRef}
            rows={1}
            className="max-h-36 min-h-[44px] flex-1 resize-none border-0 bg-transparent px-2 py-2.5 text-sm text-ink outline-none placeholder:text-ink-soft"
            placeholder={
              canChat ? "Message VYOMAI…" : "Add HF token in Settings first"
            }
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            disabled={loading || !canChat}
          />
          <button
            type="submit"
            className="vyom-btn vyom-btn-primary !rounded-xl !px-4 !py-2.5 shrink-0"
            disabled={loading || !canChat || !input.trim()}
          >
            Send
          </button>
        </div>
        <p className="mx-auto mt-2 max-w-2xl text-center text-[11px] text-ink-soft">
          Enter to send · Shift+Enter for new line
        </p>
      </form>
    </div>
  );
}
