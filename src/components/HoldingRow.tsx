import styles from "./HoldingRow.module.css";

interface Props {
  holding: {
    id: string;
    symbol: string;
    quantity: number;
    buyPrice: number;
    type: string;
  };
  currentPrice?: number;
}

export default function HoldingRow({ holding, currentPrice }: Props) {
  const diff = currentPrice
    ? ((currentPrice - holding.buyPrice) / holding.buyPrice) * 100
    : null;

  return (
    <div className={styles.row}>
      <span className={styles.sym}>{holding.symbol}</span>
      <span className={styles.meta}>
        {holding.quantity} × {holding.buyPrice.toFixed(2)} ₺
      </span>
      {diff !== null && (
        <span className={diff >= 0 ? styles.gain : styles.loss}>
          {diff >= 0 ? '+' : ''}{diff.toFixed(2)}%
        </span>
      )}
      <span className={styles.tag}>{holding.type}</span>
    </div>
  );
}
