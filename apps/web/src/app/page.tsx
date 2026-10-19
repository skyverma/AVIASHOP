import Link from "next/link";
import { GrowthNetwork } from "@/components/landing/GrowthNetwork";
import { MethodSteps } from "@/components/landing/MethodSteps";

export default function LandingPage() {
  return (
    <div className="landing-root relative min-h-screen overflow-x-hidden">
      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
        <div className="flex items-baseline gap-3">
          <span
            className="text-2xl font-semibold tracking-tight text-ink"
            style={{ fontFamily: "var(--font-display)" }}
          >
            VYOMAI
          </span>
          <span className="hidden text-xs tracking-[0.16em] text-ink-soft uppercase sm:inline">
            Manage store & business
          </span>
        </div>
        <nav className="flex items-center gap-2 sm:gap-3">
          <a href="#method" className="hidden text-sm text-ink-soft sm:inline">
            How it works
          </a>
          <Link href="/app" className="vyom-btn vyom-btn-primary !bg-ink hover:!bg-ink/90">
            Try now →
          </Link>
        </nav>
      </header>

      <main>
        <section className="relative mx-auto max-w-6xl px-4 pt-8 pb-10 sm:px-6 sm:pt-14 sm:pb-16">
          <div className="mx-auto max-w-3xl text-center animate-rise">
            <p className="mb-4 inline-flex rounded-full border border-line bg-white/70 px-3 py-1 text-xs font-semibold tracking-[0.16em] text-amber uppercase">
              Store intelligence
            </p>
            <h1
              className="text-4xl leading-[1.05] font-semibold text-ink sm:text-6xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Manage your store.
              <span className="block text-amber"> Grow your business.</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg">
              VYOMAI turns inventory, pricing, sales, and credit into clear
              growth curves — so every decision compounds.
            </p>
          </div>

          <div className="relative mx-auto mt-10 max-w-5xl animate-rise" style={{ animationDelay: "120ms" }}>
            <div className="pointer-events-none absolute -top-5 left-1/2 z-10 -translate-x-1/2">
              <Link
                href="/app"
                className="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5"
              >
                Try now
                <span aria-hidden>→</span>
              </Link>
            </div>
            <GrowthNetwork />
          </div>
        </section>

        <section id="method" className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="mb-8 max-w-2xl">
            <p className="text-xs font-semibold tracking-[0.18em] text-amber uppercase">
              Our method
            </p>
            <h2
              className="mt-3 text-3xl font-semibold text-ink sm:text-4xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Track. Price. Grow. Act.
            </h2>
            <p className="mt-3 text-ink-soft">
              Click each step — the same loop VYOMAI runs for your shop every day.
            </p>
          </div>
          <MethodSteps />
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
          <div className="rounded-[28px] border border-line bg-white px-6 py-10 text-center sm:px-10">
            <h2
              className="text-3xl font-semibold text-ink"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Ready to run your shop with VYOMAI?
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-ink-soft">
              Start with a clean workspace. Add Item 1, Item 2… — then open AI
              Chat anytime from the right.
            </p>
            <Link href="/app" className="vyom-btn vyom-btn-primary mt-6 inline-flex">
              Open workspace
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
