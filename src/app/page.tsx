"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";

interface Portfolio {
  id: string;
  name: string;
  holdings: Holding[];
}

interface Holding {
  id: string;
  symbol: string;
  quantity: number;
  buyPrice: number;
  type: string;
}

export default function Home() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [name, setName] = useState("");
  const [userId, setUserId] = useState("default");

  useEffect(() => {
    fetch("/api/portfolios").then((r) => r.json()).then(setPortfolios);
  }, []);

  const add = async () => {
    if (!name) return;
    const res = await fetch("/api/portfolios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, userId }),
    });
    if (res.ok) {
      const p = await res.json();
      setPortfolios([...portfolios, p]);
      setName("");
    }
  };

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Portföy Takip</h1>
      <section className={styles.card}>
        <h2>Portföy Ekle</h2>
        <input
          className={styles.input}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Portföy adı"
        />
        <button className={styles.btn} onClick={add}>Ekle</button>
      </section>
      <section className={styles.list}>
        {portfolios.map((p) => (
          <div key={p.id} className={styles.card}>
            <strong>{p.name}</strong>
            <small>{p.holdings?.length || 0} varlık</small>
          </div>
        ))}
      </section>
    </main>
  );
}
