"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChatDrawerProvider, useChatUi } from "@/components/ChatDrawer";
import { useShop } from "@/lib/shop-context";

const NAV = [
  { href: "/app", label: "Home" },
  { href: "/app/inventory", label: "Inventory" },
  { href: "/app/sales", label: "Sales" },
  { href: "/app/credit", label: "Credit" },
  { href: "/app/agent", label: "Agent" },
];

function ShellInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { store, ready } = useShop();
  const { openChat } = useChatUi();

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-line/70 bg-paper/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link href="/app" className="flex items-baseline gap-2">
            <span
              className="text-2xl font-semibold tracking-tight text-ink"
              style={{ fontFamily: "var(--font-display)" }}
            >
              VYOMAI
            </span>
            <span className="hidden text-xs text-ink-soft sm:inline">
              aviagent.shop
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="vyom-btn vyom-btn-primary !px-3.5 !py-2 text-sm"
              onClick={openChat}
            >
              AI Chat
            </button>
            <div className="hidden text-right text-sm text-ink-soft sm:block">
              <div className="font-medium text-ink">
                {ready ? store.shop.name : "Loading…"}
              </div>
              <div className="text-xs">Business workspace</div>
            </div>
          </div>
        </div>
        <nav className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-3 pb-3 sm:px-5">
          {NAV.map((item) => {
            const active =
              item.href === "/app"
                ? pathname === "/app"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
                  active
                    ? "bg-teal text-white"
                    : "text-ink-soft hover:bg-white/70 hover:text-ink"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6 pb-24 sm:px-6 sm:py-8">
        {children}
      </main>
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <ChatDrawerProvider>
      <ShellInner>{children}</ShellInner>
    </ChatDrawerProvider>
  );
}
