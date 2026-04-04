"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";

interface User {
  id: string;
  name: string;
  email: string;
  portfolios?: any[];
}

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");

  useEffect(() => {
    fetch("/api/users").then((r) => r.json()).then(setUsers);
  }, []);

  const createUser = async () => {
    if (!newName || !newEmail) return;
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName, email: newEmail }),
    });
    if (res.ok) {
      const u = await res.json();
      setUsers((prev) => [...prev, u]);
      setShowCreate(false);
    }
  };

  if (!selectedUser) {
    return (
      <main className={styles.main}>
        <h1 className={styles.title}>Portföy Takip</h1>
        <div className={styles.list}>
          {users.map((u) => (
            <button key={u.id} className={styles.userBtn} onClick={() => setSelectedUser(u)}>
              <strong>{u.name}</strong>
              <small>{u.email}</small>
            </button>
          ))}
        </div>
        {!showCreate ? (
          <button className={styles.btn} onClick={() => setShowCreate(true)}>
            + Yeni Kullanıcı
          </button>
        ) : (
          <div className={styles.card}>
            <input className={styles.input} placeholder="İsim" value={newName}
              onChange={(e) => setNewName(e.target.value)} />
            <input className={styles.input} placeholder="E-posta" value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)} />
            <button className={styles.btn} onClick={createUser}>Oluştur</button>
          </div>
        )}
      </main>
    );
  }

  return <UserDashboard user={selectedUser} />;
}

function UserDashboard({ user }: { user: User }) {
  const [portfolios, setPortfolios] = useState<any[]>([]);
  const [name, setName] = useState("");

  useEffect(() => {
    fetch("/api/portfolios").then((r) => r.json()).then(setPortfolios);
  }, []);

  const add = async () => {
    if (!name) return;
    const res = await fetch("/api/portfolios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, userId: user.id }),
    });
    if (res.ok) {
      const p = await res.json();
      setPortfolios((prev) => [...prev, p]);
      setName("");
    }
  };

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>{user.name}</h1>
      <section className={styles.card}>
        <h3>Portföy Ekle</h3>
        <input className={styles.input} value={name}
          onChange={(e) => setName(e.target.value)} placeholder="Portföy adı" />
        <button className={styles.btn} onClick={add}>Ekle</button>
      </section>
      <section className={styles.list}>
        {portfolios.filter((p) => p.userId === user.id).map((p) => (
          <a key={p.id} href={`/portfolios/${p.id}`} className={styles.card}>
            <strong>{p.name}</strong>
            <small>{p.holdings?.length || 0} varlık →</small>
          </a>
        ))}
      </section>
    </main>
  );
}
