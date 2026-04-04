"use client";

import { useState, useEffect } from "react";
import HoldingRow from "@/components/HoldingRow";
import styles from "./portfolio.module.css";

interface Holding {
  id: string;
  symbol: string;
  quantity: number;
  buyPrice: number;
  type: string;
  createdAt?: string;
}

export default function PortfolioPage({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState<string | null>(null);
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [form, setForm] = useState({ symbol: "", quantity: "", buyPrice: "", type: "stock" });
  const [loading, setLoading] = useState(false);

  useEffect(() => { params.then((p) => setId(p.id)); }, [params]);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/holdings?portfolioId=${id}`).then((r) => r.json()).then(setHoldings);
    fetch(`/api/prices?portfolioId=${id}`).then((r) => r.json()).then(
      (d: any) => { setPrices(d.prices ?? {}); }, () => {}
    );
  }, [id]);

  const add = async () => {
    if (!id || !form.symbol) return;
    const res = await fetch("/api/holdings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, quantity: +form.quantity, buyPrice: +form.buyPrice, portfolioId: id }),
    });
    if (res.ok) {
      setHoldings((prev) => [...prev, await res.json()]);
      setForm({ symbol: "", quantity: "", buyPrice: "", type: "stock" });
    }
  };

  const refresh = async () => {
    if (!id) return;
    setLoading(true);
    const res = await fetch(`/api/prices?portfolioId=${id}`);
    if (res.ok) { const d = await res.json(); setPrices(d.prices ?? {}); }
    setLoading(false);
  };

  const cost = holdings.reduce((s, h) => s + h.quantity * h.buyPrice, 0);
  const current = holdings.reduce((s, h) => {
    const p = prices[h.symbol.toLowerCase()];
    return s + (p ? h.quantity * p : h.quantity * h.buyPrice);
  }, 0);
  const changePct = cost > 0 ? ((current - cost) / cost) * 100 : 0;

  if (!id) return <p>Loading…</p>;

  return (
    <main className={styles.main}>
      <a href="/" className={styles.back}>← Portföyler</a>
      <h1 className={styles.title}>Varlıklar</h1>

      <form className={styles.card} onSubmit={(e) => { e.preventDefault(); add(); }} autoComplete="off">
        <select className={styles.input} value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}>
          <option value="stock">Hisse</option>
          <option value="crypto">Kripto</option>
          <option value="fund">Fon</option>
        </select>
        <input className={styles.input} placeholder="Sembol" value={form.symbol}
          onChange={(e) => setForm({ ...form, symbol: e.target.value })} />
        <input className={styles.input} type="number" placeholder="Adet" value={form.quantity}
          onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
        <input className={styles.input} type="number" placeholder="Alış fiyatı" value={form.buyPrice}
          onChange={(e) => setForm({ ...form, buyPrice: e.target.value })} />
        <button className={styles.btn} type="button" onClick={add}>Ekle</button>
      </form>

      <div className={`${styles.total} ${changePct >= 0 ? styles.green : styles.red}`}>
        <div>Maliyet: {cost.toFixed(2)} ₺</div>
        {current > 0 && cost > 0 && (
          <div className={styles.change}>
            Değer: {current.toFixed(2)} ₺{' '}
            <span className={changePct >= 0 ? styles.up : styles.down}>
              {changePct >= 0 ? '+' : ''}{changePct.toFixed(2)}%
            </span>
          </div>
        )}
        <button className={styles.refresh} onClick={refresh} disabled={loading}>
          {loading ? '...' : 'Fiyatları yenile'}
        </button>
      </div>

      <div className={styles.list}>
        {holdings.length === 0 && <p className={styles.empty}>Varlık eklenmemiş</p>}
        {holdings.map((h) => (
          <HoldingRow key={h.id} holding={h} currentPrice={prices[h.symbol.toLowerCase()]} />
        ))}
      </div>
    </main>
  );
}
