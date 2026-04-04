"use client";

import { useState, useEffect } from "react";
import styles from "./portfolio.module.css";

interface Holding {
  id: string;
  symbol: string;
  quantity: number;
  buyPrice: number;
  type: string;
  portfolioId: string;
}

interface PriceData {
  holdings: Holding[];
  prices: Record<string, number>;
}

export default function PortfolioDetail({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState<string | null>(null);
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [form, setForm] = useState({ symbol: "", quantity: "", buyPrice: "", type: "stock" });
  const [loadingPrices, setLoadingPrices] = useState(false);

  useEffect(() => {
    params.then((p) => setId(p.id));
  }, [params]);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/holdings?portfolioId=${id}`)
      .then((r) => r.json())
      .then(setHoldings);
    fetch(`/api/prices?portfolioId=${id}`)
      .then((r) => r.json())
      .then((d: PriceData) => {
        setPrices(d.prices);
      })
      .catch(() => {});
  }, [id]);

  const addHolding = async () => {
    if (!id || !form.symbol) return;
    const res = await fetch("/api/holdings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        quantity: Number(form.quantity),
        buyPrice: Number(form.buyPrice),
        portfolioId: id,
      }),
    });
    if (res.ok) {
      const h = await res.json();
      setHoldings([...holdings, h]);
      setForm({ symbol: "", quantity: "", buyPrice: "", type: "stock" });
    }
  };

  const refreshPrices = async () => {
    if (!id) return;
    setLoadingPrices(true);
    const res = await fetch(`/api/prices?portfolioId=${id}`);
    if (res.ok) {
      const d: PriceData = await res.json();
      setPrices(d.prices);
    }
    setLoadingPrices(false);
  };

  const currentPrice = (symbol: string) => {
    return prices[symbol.toLowerCase()] ?? null;
  };

  const total = holdings.reduce((s, h) => s + h.quantity * h.buyPrice, 0);
  const totalCurrent = holdings.reduce((s, h) => {
    const cp = currentPrice(h.symbol.toLowerCase());
    return s + (cp ? h.quantity * cp : h.quantity * h.buyPrice);
  }, 0);
  const change = totalCurrent - total;
  const changePercent = total > 0 ? (change / total) * 100 : 0;

  if (!id) return <p>Yükleniyor...</p>;

  return (
    <main className={styles.main}>
      <a href="/" className={styles.back}>← Portföyler</a>
      <h1 className={styles.title}>Varlıklar</h1>

      <div className={styles.card}>
        <h3>Yeni Varlık</h3>
        <select
          className={styles.input}
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
        >
          <option value="stock">Hisse</option>
          <option value="crypto">Kripto</option>
          <option value="fund">TEFAS Fon</option>
        </select>
        <input className={styles.input} placeholder="Sembol" value={form.symbol}
          onChange={(e) => setForm({ ...form, symbol: e.target.value })} />
        <input className={styles.input} type="number" placeholder="Adet" value={form.quantity}
          onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
        <input className={styles.input} type="number" placeholder="Alış fiyatı" value={form.buyPrice}
          onChange={(e) => setForm({ ...form, buyPrice: e.target.value })} />
        <button className={styles.btn} onClick={addHolding}>Ekle</button>
      </div>

      <div className={`${styles.total} ${change >= 0 ? styles.green : styles.red}`}>
        <div>Toplam: <strong>{currentPrice ? totalCurrent.toFixed(2) : total.toFixed(2)} ₺</strong></div>
        {currentPrice && (
          <div className={styles.change}>
            {change >= 0 ? "↑" : "↓"} {change.toFixed(2)} ₺ ({changePercent.toFixed(2)}%)
          </div>
        )}
        <button className={styles.refresh} onClick={refreshPrices} disabled={loadingPrices}>
          {loadingPrices ? "..." : "Fiyatları Güncelle"}
        </button>
      </div>

      <div className={styles.list}>
        {holdings.map((h) => {
          const cp = currentPrice(h.symbol.toLowerCase());
          const diff = cp ? ((cp - h.buyPrice) / h.buyPrice) * 100 : null;
          return (
            <div key={h.id} className={styles.item}>
              <span className={styles.sym}>{h.symbol}</span>
              <span className={styles.meta}>
                {h.quantity} × {h.buyPrice} ₺
              </span>
              {diff !== null && (
                <span className={diff >= 0 ? styles.gain : styles.loss}>
                  {diff >= 0 ? "+" : ""}{diff.toFixed(2)}%
                </span>
              )}
              <span className={styles.tag}>{h.type}</span>
            </div>
          );
        })}
      </div>
    </main>
  );
}
