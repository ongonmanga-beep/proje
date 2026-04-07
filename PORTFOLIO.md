# Portföy Takip & Finansal Özgürlük

**Son güncelleme:** 2026-04-07
**Durum:** Active Development

---

## 📊 Portföy İçerikleri

### Aktif Varlıklar

#### Kripto Varlıklar
- **BTC:** 40% - Bitcoin
- **ETH:** 30% - Ethereum
- **SOL:** 30% - Solana

**Toplam Varlık Dağılımı:** Kripto (%100)

---

### Portföy Hedefleri

#### Kısa Vadeli (3-6 Ay)
- [ ] TEFAS fon entegrasyonu
- [ ] Gerçek zamanlı fiyat güncellemeleri
- [ ] Dashboard geliştirmesi (detaylı istatistikler)

#### Orta Vadeli (6-12 Ay)
- [ ] Alt portföyler (sub-portfolios)
- [ ] Otomatik dengelenme (rebalancing)
- [ ] Grafik analiz araçları

#### Uzun Vadeli (1+ Yıl)
- [ ] Mobile app (React Native)
- [ ] Advanced analytics (AI-powered insights)
- [ ] Multi-asset support (hisse senedi, emtia)

---

## 🛠️ Araçlar

### Frontend Stack
- **Next.js 15** - App Router, Server Components
- **React Query / SWR** - Parallel data fetching
- **TailwindCSS + shadcn/ui** - Component library
- **Recharts** - Data visualization
- **TypeScript** - Type-safe development

### Backend Stack
- **PostgreSQL** - Primary database
- **Drizzle ORM** - Database toolkit
- **Drizzle Kit** - Migration tool
- **postgres.js** - Database driver
- **Zod** - Schema validation

### DevOps
- **Docker Compose** - Container orchestration
- **VPS** - http://62.171.147.85:85
- **Mac mini** - Local development environment
- **OpenClaw** - AI assistant & automation

### CLI Tools
- **tefas-crawler** - TEFAS fund data
  - Install: `pip install tefas-crawler`
  - GitHub: github.com/burakyilmaz321/tefas-crawler

### Design Tools
- **Superdesign** - Frontend design system
  - Modern oklch-based dark-mode colors
  - Inter / DM Sans typography
  - 150-200ms micro-animations
  - Glassmorphism effects
  - Premium Vercel-style minimal aesthetic

### Memory & Documentation
- **mem0.ai** - Cloud memory system
  - API Key: m0-7t341BJCD9qtT62qghBT4Xf4SCOMAw85fPJ9D2a0
  - Project ID: proj_jIh3Oa0McUVDBEhz1QFGhjTNuQHi8mCMpZWTECAZ
  - Active memories: 36+

- **Notion** - Project documentation
  - Integration: openclaw
  - Workspace: Salih özcan's Notion

---

## 💻 Teknik Prensipler

### Database Operations
- **Idempotent operations** - Tüm DB işlemleri ve cron job'lar idempotent olmalı
- **UPSERT Pattern** - Fiyat verileri için `ON CONFLICT DO UPDATE`
- **Unique Constraints** - Duplicate record'ları önle
- **Atomic Transactions** - Çok tablolu işlemler için transaction kullan
- **Connection Pooling** - postgres.js Singleton pattern, max connections limit
- **Prepared Statements** - Sık kullanılan sorgular için (örn: portfolio summary)

### Frontend Architecture
- **Server-First** - Server Components > Client Components
- **Route Handlers** - Sadece external triggers için (webhooks, mobile APIs)
- **Parallel Queries** - React Query/SWR ile paralel data fetching
- **Non-blocking Dashboard** - Bir widget fail olsa bile diğerleri yüklenmeli
- **Production-Ready Code** - Placeholders yok, tam code

### TypeScript Standards
- **No 'any' type** - 'any' tipini kullanma
- **Use 'unknown'** - Bilinmeyen data için 'unknown' + type guards
- **Disallow implicit any** - Implicit any'i engelle

### Code Style
- **Short code blocks** - Uzun code block'lardan kaçın
- **External style files** - Style'ları inline değil, external dosyalarda tut
- **Add to existing** - Mevcut sistemlere ekle, değiştirme

---

## 📈 Proje İlerlemesi

### ✅ Tamamlanan (Done)

#### 2026-04-02
- [x] Portföy takip uygulaması başlatıldı
- [x] Mobile-first design
- [x] TEFAS integration planlandı
- [x] Core principles: Consistency, Reliability, Coherence

#### 2026-04-04
- [x] Database schema tanımlandı (5 tables)
- [x] Dependencies kurulumu (drizzle-orm, postgres, drizzle-zod, drizzle-kit)
- [x] Technical standards belirlendi
- [x] Server-First architecture
- [x] PostgreSQL connection pooling
- [x] Prepared statements pattern

#### 2026-04-06
- [x] mem0.ai plugin cloud/platform mode'a geçti
- [x] Workspace: ~/.openclaw/workspace/projem/
- [x] OpenClaw Gateway: Port 18789
- [x] Superdesign skill kuruldu

#### 2026-04-07
- [x] Cortex assistant configured (Turkish language)
- [x] mem0.ai memories unified (36 → salih user_id)
- [x] Notion API key configured
- [x] Project documentation created (PORTFOLIO.md)
- [x] Complete technical documentation

### 🚧 Devam Eden (In Progress)
- [ ] TEFAS crawler integration
- [ ] Live price updates
- [ ] Dashboard enhancements

### 📋 Planlanan (Planned)

#### Kısa Vadeli
- [ ] TEFAS fon verilerini çeken cron job
- [ ] Fiyat güncelleme sistemi (API entegrasyonları)
- [ ] Detaylı dashboard istatistikleri
- [ ] Portfolio performans grafikleri

#### Orta Vadeli
- [ ] Sub-portfolios feature (çoklu portföy)
- [ ] Asset allocation calculator
- [ ] Rebalancing suggestions
- [ ] Alert system (fiyat değişimleri)

#### Uzun Vadeli
- [ ] Mobile app (React Native)
- [ ] AI-powered insights
- [ ] Multi-asset support (hisse senedi, emtia, ETF)
- [ ] Advanced analytics (risk assessment, diversification)

---

## 🗂️ Database Schema

### Tables
1. **users** - Kullanıcı bilgileri
2. **portfolios** - Portföy detayları
3. **holdings** - Varlık pozisyonları
4. **transactions** - İşlem geçmişi
5. **price_history** - Fiyat geçmişi

### Numeric Types
- `quantity` - Varlık miktarı
- `avgBuyPrice` - Ortalama alış fiyatı
- `totalPrice` - Toplam işlem değeri
- `currentPrice` - Güncel piyasa fiyatı
- `price` - Fiyat verisi
- `totalCost` - Toplam maliyet

### Migrations
- Tool: `drizzle-kit generate:pg`
- Location: `drizzle/migrations/`

---

## 🎯 Çalışma Prensipleri

### Efficiency
- **Doğrudan ve öz** - Gereksiz detay yok
- **Token verimliliği** - Minimum API call
- **Minimal sorgulama, maksimum eylem** - Soru sorma, yap
- **Süslü formatting yok** - Fancy output yok

### Quality
- **Consistency** - Tutarlı kod ve prensipler
- **Reliability** - Güvenilir sistemler
- **Coherence** - Tutarlı mimari

---

## 📝 Notlar

### Environment
- **OS:** macOS (Darwin 25.3.0, arm64)
- **Node:** v24.14.0
- **Python:** 3.13
- **Shell:** zsh
- **Timezone:** Europe/Istanbul (GMT+3)

### Communication Channels
- **Telegram ID:** 5736032360
- **Email:** salihozcanhayli@gmail.com
- **Language:** Turkish (primary), English (secondary)

### Quick Commands
```bash
# Start dev server
cd ~/.openclaw/workspace/projem && npm run dev

# Run migrations
npx drizzle-kit generate:pg

# Docker deployment
docker-compose up -d

# TEFAS crawler
pip install tefas-crawler
tefas-crawler --help
```

---

**Son güncelleme:** 2026-04-07 15:55
**İlerleme:** ~40% (development phase)
**Sonraki milestone:** TEFAS integration
