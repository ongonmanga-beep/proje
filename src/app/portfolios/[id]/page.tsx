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

export default function PortfolioDetail({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState<string | null>(null);
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [form, setForm] = useState({ symbol: "", quantity: "", buyPrice: "", type: "stock" });

  useEffect(() => {
    params.then((p) => setId(p.id));
  }, [params]);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/holdings?portfolioId=${id}`)
      .then((r) => r.json())
      .then(setHoldings);
  }, [id]);

  const addHolding = async () => {
    if (!id || !form.symbol) return;
    const res = await fetch("/api/holdings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, quantity: Number(form.quantity), buyPrice: Number(form.buyPrice), portfolioId: id }),
    });
    if (res.ok) {
      const h = await res.json();
      setHoldings([...holdings, h]);
      setForm({ symbol: "", quantity: "", buyPrice: "", type: "stock" });
    }
  };

  const total = holdings.reduce((s, h) => s + h.quantity * h.buyPrice, 0);

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
        <input className={styles.input} placeholder="Sembol (örn: THYAO)" value={form.symbol}
          onChange={(e) => setForm({ ...form, symbol: e.target.value })} />
        <input className={styles.input} type="number" placeholder="Adet" value={form.quantity}
          onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
        <input className={styles.input} type="number" placeholder="Alış fiyatı" value={form.buyPrice}
          onChange={(e) => setForm({ ...form, buyPrice: e.target.value })} />
        <button className={styles.btn} onClick={addHolding}>Ekle</button>
      </div>

      <div className={styles.total}>
        Toplam: <strong>{total.toFixed(2)} ₺</strong>
      </div>

      <div className={styles.list}>
        {holdings.map((h) => (
          <div key={h.id} className={styles.card}>
            <span className={styles.sym}>{h.symbol}</span>
            <span className={styles.meta}>
              {h.quantity} × {h.buyPrice} ₺
            </span>
            <span className={styles.tag}>{h.type}</span>
          </div>
        ))}
      </div>
    </main>
  );
}
