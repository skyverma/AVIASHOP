# VYOMAI

AI-native inventory, pricing, revenue, and profit for small to large businesses.

- **Product name:** VYOMAI  
- **Domain:** [aviagent.shop](https://aviagent.shop)  
- **Repo folder:** `AVIASHOP`

## What's in V1

| Area | Status |
|------|--------|
| Product inventory (cost / sell / qty) | ✅ |
| Sales with automatic stock + profit | ✅ |
| Credit / udhaar ledger | ✅ |
| Agent insights (reorder, dead stock, pricing, credit risk) | ✅ |
| Local demo store (browser) | ✅ |
| Supabase schema | ✅ ready to wire |
| Mobile (Expo) | ⏳ next phase |
| Phone OTP auth | ⏳ after Supabase project |

## Monorepo

```
AVIASHOP/
├── apps/web                 # Next.js — VYOMAI web app
├── packages/insights        # Shared agentic rules engine
├── packages/api-client      # Types + local shop mutations
├── packages/ui              # Design tokens
└── supabase/schema.sql      # Postgres schema for production
```

## Run locally

```bash
cd AVIASHOP
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to aviagent.shop

1. Push this repo to GitHub.
2. Import `AVIASHOP` (or root) in Vercel; set root directory to `apps/web` **or** use the monorepo install from repo root (`npm install` + `npm run build`).
3. Point `aviagent.shop` DNS to Vercel.

Recommended Vercel settings when deploying from monorepo root:

- **Install:** `npm install`
- **Build:** `npm run build`
- **Output:** Next.js (from `@vyomai/web`)

## Agentic model

V1 insights are **deterministic rules** in `@vyomai/insights` (same logic for web and future mobile):

- Reorder: &lt; 3 days cover from 14-day average sales  
- Dead stock: no sales in 30 days with qty &gt; 0  
- Pricing: margin far below shop average  
- Credit risk: on-time ratio minus overdue penalty  

### Free LLM (Hugging Face)

Chat on `/app/agent` uses Hugging Face Inference Providers (same router as AVIAGENT):

```bash
cp apps/web/.env.example apps/web/.env.local
# set HUGGINGFACE_API_KEY=hf_...
```

Token: [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens) — enable **Inference Providers**.  
Default model: `deepseek-ai/DeepSeek-V3-0324`. You can also paste a token under **HF settings** in the Agent UI.

## Out of scope for V1

GST invoicing · e-way bills · multi-language · offline sync · loans · barcode · multi-staff accounts
