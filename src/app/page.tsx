"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";

export default function Home() {
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/users").then((r) => r.json()).then(setUsers);
  }, []);

  if (!selectedUserId) {
    return <AuthScreen users={users} onLogin={setSelectedUserId} />;
  }
  return <Dashboard userId={selectedUserId} onLogout={() => setSelectedUserId(null)} />;
}

function AuthScreen({ users, onLogin }: { users: any[]; onLogin: (id: string) => void }) {
  const [mode, setMode] = useState<"list" | "create">("list");
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleCreate = async () => {
    if (!form.email || !form.password) return;
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, passwordHash: btoa(form.password) }),
    });
    if (res.ok) {
      const u = await res.json();
      onLogin(u.id);
    }
  };

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Portföy Takip</h1>

      {mode === "list" && (
        <>
          <div className={styles.userList}>
            {users.map((u) => (
              <button key={u.id} className={styles.userCard} onClick={() => onLogin(u.id)}>
                <strong>{u.name || u.email}</strong>
                <small>{u.email}</small>
              </button>
            ))}
          </div>
          {users.length === 0 && <p className={styles.empty}>Henüz kullanıcı yok</p>}
          <button className={styles.btn} onClick={() => setMode("create")}>Yeni Hesap</button>
        </>
      )}

      {mode === "create" && (
        <div className={styles.card}>
          <h3>Kayıt</h3>
          <input className={styles.input} placeholder="İsim" value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input className={styles.input} placeholder="E-posta" type="email" value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input className={styles.input} placeholder="Şifre" type="password" value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <button className={styles.btn} onClick={handleCreate}>Oluştur</button>
          <button className={styles.link} onClick={() => setMode("list")}>← Geri</button>
        </div>
      )}
    </main>
  );
}

function Dashboard({ userId, onLogout }: { userId: string; onLogout: () => void }) {
  const [portfolios, setPortfolios] = useState<any[]>([]);

  useEffect(() => {
    fetch(`/api/portfolios?userId=${userId}`).then((r) => r.json()).then(setPortfolios);
  }, [userId]);

  const addPortfolio = async () => {
    const name = prompt("Portföy adı:");
    if (!name) return;
    const res = await fetch("/api/portfolios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, userId }),
    });
    if (res.ok) {
      const p = await res.json();
      setPortfolios((prev) => [...prev, p]);
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <button className={styles.btnSmall} onClick={onLogout}>← Çıkış</button>
        <button className={styles.btnSmall} onClick={addPortfolio}>+ Portföy</button>
      </div>
      <h1 className={styles.title}>Portföylerim</h1>

      {portfolios.length === 0 && <p className={styles.empty}>Henüz portföy yok</p>}

      {portfolios.map((p) => (
        <a key={p.id} href={`/portfolios/${p.id}`} className={styles.card}>
          <div>
            <strong>{p.name}</strong>
            <small>{p.holdings?.length || 0} varlık</small>
          </div>
          <span className={styles.arrow}>→</span>
        </a>
      ))}
    </main>
  );
}
