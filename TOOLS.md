# TOOLS.md - Local Notes

Skills define _how_ tools work. This file is for _your_ unique setup.

---

## ⚡ Core Principle - EFFICIENCY

**Direct, concise, no waste.**
- Avoid unnecessary token consumption
- No fancy formatting unless requested
- Be efficient and to the point
- This overrides all output styles

---

## 🎨 Design Principles (Superdesign) - CRITICAL

**Superdesign prensiplerini her UI tasarımında uygula:**
- **Color Palette:** Modern oklch-based dark-mode colors
- **Typography:** Inter (primary) / DM Sans (secondary/headings)
- **Animations:** 150-200ms micro-animations
- **Effects:** Glassmorphism, premium linear/Vercel-style minimal aesthetic
- **Spacing:** Standard Tailwind spacing
- **Contrast:** Size/weight contrast for hierarchy
- **Colors:** Semantic colors for profit/loss
- **Interactions:** Micro-interactions (hover/active, skeleton loading)
- **Placeholders:** Empty table/list placeholders

**NOT:** Her zaman bu prensipleri uygula!

---

## 🚀 Active Projects

### Financial Portfolio Dashboard
- **Stack:** Next.js 15 App Router, TailwindCSS + shadcn/ui, PostgreSQL with Drizzle ORM, Docker Compose, Recharts
- **Deployment:** Docker on VPS at `http://62.171.147.85:85`
- **Pages:** `/login`, `/register`, minimalist pie chart for portfolio distribution
- **Architecture:** Server-First (Server Components > Client Components), Route Handlers only for external triggers (webhooks/mobile APIs)
- **Status:** Live and running

### Database Schema
Tables: `users`, `portfolios`, `holdings`, `transactions`, `price_history`
- Numeric types: quantity, avgBuyPrice, totalPrice, currentPrice, price, totalCost
- Zod schemas for validation
- Drizzle Kit for migrations (`drizzle-kit generate:pg`)

### Data Sources
- **Stocks/Crypto:** TBD
- **TEFAS:** tefas-crawler library (github.com/burakyilmaz321/tefas-crawler, `pip install tefas-crawler`)
- **Portfolio:** 40% BTC, 30% ETH, 30% SOL

---

## 📄 Project Documentation

- **Portfolio Doc:** `PORTFOLIO.md` - Complete project documentation
- **Update Policy:** Proje ilerledikçe bu dosyayı güncelle
- **Content:** Portföy içerikleri, araçlar, teknik prensipler, ilerleme

---

## 💻 Technical Standards

### Database Operations
- **Idempotent:** All DB operations and cron jobs must be idempotent
- **UPSERT Pattern:** Use `ON CONFLICT DO UPDATE` for price data
- **Unique Constraints:** Prevent duplicate records
- **Transactions:** Use DB transactions for operations affecting multiple tables (atomic with rollback on error)
- **Connection Pool:** Use postgres.js driver with Singleton pattern in `db/index.ts`, limit max connections based on VPS capacity
- **Prepared Statements:** Configure frequently-used queries (e.g., portfolio summary) as Prepared Statements in Drizzle ORM

### Frontend Architecture
- **Parallel Queries:** Use React Query or SWR for parallel data fetching (if one widget fails, others continue loading)
- **Dashboard Never Blocks:** Ensure dashboard doesn't block for a single failed request
- **Code Quality:** No placeholders like "rest of code goes here" or "// existing code"
- **Code Style:** Complete, production-ready code from start to finish
- **Separation:** Style files separated into external files, not inline
- **TypeScript:** Avoid 'any' type, prefer 'unknown' for unknown data with type guards, disallow implicit any

---

## 👤 User Preferences

- **Name:** Salih Özcan
- **Telegram ID:** 5736032360
- **Email:** salihozcanhayli@gmail.com
- **Language:** Turkish (prefers Turkish communication)
- **Communication:** Minimal questioning, more action, short concise responses
- **Timezone:** Europe/Istanbul (GMT+3)
- **Device:** Mac mini
- **Channels:** Telegram (main channel), webchat

---

## 🗂️ Workspace & Environment

- **Workspace:** `~/.openclaw/workspace/`
- **Notion:** API key configured (workspace: 'Salih özcan\'s Notion', integration: openclaw)
- **Project Workspace:** `~/.openclaw/workspace/projem/`
- **OpenClaw Gateway:** Port 18789 (local mode)
- **Platform:** Mac mini (Salih runs OpenClaw on Mac mini)

---

## 🧠 Memory System

**Primary:** mem0.ai cloud (API key: `m0-7t341BJCD9qtT62qghBT4Xf4SCOMAw85fPJ9D2a0`)
- Project ID: `proj_jIh3Oa0McUVDBEhz1QFGhjTNuQHi8mCMpZWTECAZ`
- Project name: `default-project`
- Owner: salih
- **Current status:** 36 memories retrieved via API (dashboard shows 80 - may include deleted/archived)

**Backup strategy:**
- Weekly manual backup to local files (mem0_backup_*.md)
- Local daily notes in memory/YYYY-MM-DD.md (optional, for raw logs)

**Memory types:**
- mem0.ai cloud: Important decisions, preferences, projects
- TOOLS.md: Technical notes (local, this file)
- memory/YYYY-MM-DD.md: Daily logs (optional)

**Never store in mem0.ai:**
- Passwords
- Private keys
- Sensitive API keys

---

## 🎯 Core Principles

1. **Consistency, Reliability, Coherence:** These are core principles for portfolio tracking web app project
2. **Mobile-First Design:** Portfolio tracking web app has mobile-first design
3. **Action Over Questions:** Minimal questioning, more action
4. **Add to Existing:** Prefer adding to existing systems rather than replacing them

---

## 📊 Project History

### mem0.ai Integration
- **2026-04-06:** Migrated mem0 plugin to cloud/platform mode
- **2026-04-07:** Cortex (🧠) assistant configured with Turkish language and Superdesign principles

### Portfolio App Development
- **2026-04-02:** Started portfolio tracking web app with mobile-first design
- **2026-04-04:** Database schema defined, dependencies installed (drizzle-orm, postgres, drizzle-zod, drizzle-kit, @types/pg)
- Technical standards established: idempotent operations, parallel queries, prepared statements
- TEFAS integration planned with tefas-crawler library

---

## 🔑 API Keys & Config

### mem0.ai
- **API key:** `m0-7t341BJCD9qtT62qghBT4Xf4SCOMAw85fPJ9D2a0`
- **Project ID:** `proj_jIh3Oa0McUVDBEhz1QFGhjTNuQHi8mCMpZWTECAZ`
- **Project name:** `default-project`
- **Owner:** salih

### Important Notes
- Always update mem0.ai with important decisions, preferences, and learnings
- Don't store passwords or private keys in mem0.ai
- Use TOOLS.md for local sensitive references (non-sensitive technical notes)

---

## 📝 Memory Status

- **mem0.ai API:** 36 active memories retrieved (2026-04-07)
- **mem0.ai Dashboard:** Shows 80 memories (may include deleted/archived or different view)
- **Summary endpoint:** 3 summary memories (aggregated)

**Discrepancy note:** API returns 36 memories but dashboard shows 80. This could be due to:
1. Dashboard showing deleted/archived memories
2. Different view or filter settings
3. Pagination issues in API

**Current approach:** API is reliable for active memories. Dashboard may include additional historical/deleted data not accessible via API.

---

_Add more environment-specific notes as needed. This is your cheat sheet._
