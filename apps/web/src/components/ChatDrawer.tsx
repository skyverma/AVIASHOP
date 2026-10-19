"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { AgentChat } from "@/components/AgentChat";

type ChatUiContextValue = {
  open: boolean;
  openChat: () => void;
  closeChat: () => void;
  toggleChat: () => void;
};

const ChatUiContext = createContext<ChatUiContextValue | null>(null);

export function useChatUi() {
  const ctx = useContext(ChatUiContext);
  if (!ctx) throw new Error("useChatUi must be used within ChatDrawerProvider");
  return ctx;
}

export function ChatDrawerProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const openChat = useCallback(() => setOpen(true), []);
  const closeChat = useCallback(() => setOpen(false), []);
  const toggleChat = useCallback(() => setOpen((v) => !v), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  const value = useMemo(
    () => ({ open, openChat, closeChat, toggleChat }),
    [open, openChat, closeChat, toggleChat]
  );

  return (
    <ChatUiContext.Provider value={value}>
      {children}

      {!open ? (
        <button
          type="button"
          onClick={openChat}
          className="fixed right-4 bottom-4 z-40 flex items-center gap-2 rounded-full bg-teal px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-teal/25 transition hover:bg-teal-deep sm:right-6 sm:bottom-6"
          aria-label="Open AI chat"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M4 12c0-4.4 3.6-8 8-8h0c4.4 0 8 3.6 8 8v5.2c0 .9-.7 1.6-1.6 1.6H12c-4.4 0-8-3.6-8-8Z"
                stroke="currentColor"
                strokeWidth="1.8"
              />
              <path
                d="M8.5 11.5h.01M12 11.5h.01M15.5 11.5h.01"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
              />
            </svg>
          </span>
          AI Chat
        </button>
      ) : null}

      <div
        className={`fixed inset-0 z-50 transition ${
          open ? "pointer-events-auto" : "pointer-events-none"
        }`}
        aria-hidden={!open}
      >
        <button
          type="button"
          className={`absolute inset-0 bg-ink/35 backdrop-blur-[2px] transition-opacity duration-300 ${
            open ? "opacity-100" : "opacity-0"
          }`}
          aria-label="Close chat backdrop"
          onClick={closeChat}
        />

        <aside
          className={`absolute inset-y-0 right-0 flex w-full max-w-[440px] flex-col border-l border-line bg-white shadow-2xl transition-transform duration-300 ease-out sm:max-w-[480px] ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
          role="dialog"
          aria-modal="true"
          aria-label="VYOMAI AI chat"
        >
          {open ? <AgentChat variant="drawer" onClose={closeChat} /> : null}
        </aside>
      </div>
    </ChatUiContext.Provider>
  );
}
