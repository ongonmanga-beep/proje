"use client";

import Link from "next/link";
import styles from "@/app/page.module.css";

interface Portfolio {
  id: string;
  name: string;
  userId: string;
  holdings: any[];
}

export default function PortfolioList({ portfolios }: { portfolios: Portfolio[] }) {
  if (portfolios.length === 0) {
    return <p className={styles.empty}>Henüz portföy yok</p>;
  }

  return (
    <div className={styles.list}>
      {portfolios.map((p) => (
        <Link key={p.id} href={`/portfolios/${p.id}`} className={styles.card}>
          <strong>{p.name}</strong>
          <small>{p.holdings?.length || 0} varlık →</small>
        </Link>
      ))}
    </div>
  );
}
