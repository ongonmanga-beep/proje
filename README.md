# Portföy Takip

Mobile-first portföy takip uygulaması.

## Stack

- Next.js 15 (App Router)
- TypeScript
- TailwindCSS v4 (ayrı stil dosyaları)
- Drizzle ORM + SQLite
- CoinGecko API (kripto)
- TEFAS Crawler (Türk fonları)

## Kurulum

```bash
npm install
npx drizzle-kit push
npm run dev
```

## API Endpoints

- `GET/POST /api/users` — Kullanıcılar
- `GET/POST /api/portfolios` — Portföyler
- `GET/POST /api/holdings` — Varlıklar
- `GET /api/prices?portfolioId=` — Fiyat güncelleme
- `GET /api/funds` — TEFAS fon listesi

## İlk Kullanım

1. `/users` → kullanıcı oluştur
2. `/` → kullanıcıyı seç
3. Portföy ekle
4. Portföye tıkla → varlık ekle

## Varlık Tipleri

- **stock** — Hisse senedi
- **crypto** — Kripto
- **fund** — TEFAS fonu
