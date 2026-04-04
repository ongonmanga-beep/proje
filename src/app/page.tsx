"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";

export default function Home() {
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [mode, setMode] = useState<"list" | "login" | "create">("list");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [portfolios, setPortfolios] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/users").then((r) => r.json()).then(setUsers);
  }, []);

  useEffect(() => {
    if (!selectedUserId) return;
    fetch(`/api/portfolios?userId=${selectedUserId}`)
      .then((r) => r.json())
      .then(setPortfolios);
  }, [selectedUserId]);

  const handleCreate = async () => {
    if (!form.email || !form.password) return;
    const p = form.password;
    const hash = btoa(p);
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, passwordHash: hash }),
    });
    if (res.ok) {
      const u = await res.json();
      setUsers((prev) => [...prev, u]);
      setMode("list");
    }
  };

  const handleLogin = async () => {
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: form.email, password: btoa(form.password) }),
    });
    if (res.ok) {
      const u = await res.json();
      setSelectedUserId(u.id);
    }
  };

  const addPortfolio = async () => {
    const name = prompt("Portföy adı:");
    if (!name || !selectedUserId) return;
    const res = await fetch("/api/portfolios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, userId: selectedUserId }),
    });
    if (res.ok) {
      const p = await res.json();
      setPortfolios((prev) => [...prev, p]);
    }
  };

  // ── Auth screen ──────────────────────────
  if (!selectedUserId) {
    return (
      <main className={styles.main}>
        <h1 className={styles.title}>Portföy Takip</h1>
        {mode === "list" && (
          <>
            <div className={styles.list}>
              {users.map((u) => (
                <button key={u.id} className={styles.userBtn} onClick={() => { setSelectedUserId(u.id); }}>
                  <strong>{u.name}</strong>
                  <small>{u.email}</small>
                </button>
              ))}
            </div>
            <div className={styles.row}>
              <button className={styles.btn} onClick={() => setMode("login")}>Giriş</button>
              <button className={styles.btnOutline} onClick={() => setMode("create")}>Kayıt</button>
            </div>
          </>
        )}
        {mode === "login" && (
          <div className={styles.card}>
            <h3>Giriş</h3>
            <input className={styles.input} placeholder="E-posta"
              onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <input className={styles.input} type="password" placeholder="Şifre"
              onChange={(e) => setForm({ ...form, password: e.target.value })} />
            <button className={styles.btn} onClick={handleLogin}>Giriş Yap</button>
            <button className={styles.link} onClick={() => setMode("list")}>← Geri</button>
          </div>
        )}
        {mode === "create" && (
          <div className={styles.card}>
            <h3>Kayıt</h3>
            <input className={styles.input} placeholder="İsim"
              onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input className={styles.input} placeholder="E-posta"
              onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <input className={styles.input} type="password" placeholder="Şifre"
              onChange={(e) => setForm({ ...form, password: e.target.value })} />
            <button className={styles.btn} onClick={handleCreate}>Kayıt Ol</button>
            <button className={styles.link} onClick={() => setMode("list")}>← Geri</button>
          </div>
        )}
      </main>
    );
  }

  // ── Dashboard ────────────────────────────
  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <button className={styles.logout} onClick={() => setSelectedUserId(null)}>← Çıkış</button>
        <button className={styles.addBtn} onClick={addPortfolio}>+ Portföy</button>
      </div>
      <h1 className={styles.title}>Portföylerim</h1>
      <div className={styles.list}>
        {portfolios.length === 0 && <p className={styles.empty}>Henüz portföy yok</p>}
        {portfolios.map((p) => (
          <a key={p.id} href={`/portfolios/${p.id}`} className={styles.card}>
            <div>
              <strong>{p.name}</strong>
              <small>{p.holdings?.length || 0} varlık</small>
            </div>
            <span>→</span>
          </a>
        ))}
      </div>
    </main>
  );
}
