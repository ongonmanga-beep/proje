"use client";

import { useState } from "react";

export default function UsersPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [created, setCreated] = useState<any>(null);

  const createUser = async () => {
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, name }),
    });
    if (res.ok) {
      const u = await res.json();
      setCreated(u);
    }
  };

  return (
    <div style={{ padding: "1rem", maxWidth: 480, margin: "0 auto" }}>
      <a href="/">← Ana Sayfa</a>
      <h3>Kullanıcı Oluştur</h3>
      <input onChange={(e) => setName(e.target.value)} style={{ width: "100%", marginBottom: "0.5rem", padding: "0.5rem" }} placeholder="İsim" />
      <input onChange={(e) => setEmail(e.target.value)} style={{ width: "100%", marginBottom: "0.5rem", padding: "0.5rem" }} placeholder="E-posta" />
      <button onClick={createUser}>Oluştur</button>
      {created && <p>Kullanıcı: {created.id}</p>}
    </div>
  );
}
