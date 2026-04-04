"use client";

import styles from "@/app/portfolios/[id]/portfolio.module.css";

interface Holding {
  id: string;
  symbol: string;
  quantity: number;
  buyPrice: number;
  type: string;
}

interface Props {
  holdings: Holding[];
  prices: Record<string, number>;
}

export default function HoldingList({ holdings, prices }: Props) {
  return (
    <div className={styles.list}>
      {holdings.map((h) => {
        const cp = prices[h.symbol.toLowerCase()] ?? null;
        const diff = cp ? ((cp - h.buyPrice) / h.buyPrice) * 100 : null;
        return (
          <div key={h.id} className={styles.item}>
            <span className={styles.sym}>{h.symbol}</span>
            <span className={styles.meta}>{h.quantity} × {h.buyPrice} ₺</span>
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
  );
}
