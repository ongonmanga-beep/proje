import Link from "next/link";
import styles from "./PortfolioCard.module.css";

interface Props {
  id: string;
  name: string;
  count: number;
}

export default function PortfolioCard({ id, name, count }: Props) {
  return (
    <Link href={`/portfolios/${id}`} className={styles.card}>
      <div>
        <strong>{name}</strong>
        <small>{count} varlık</small>
      </div>
      <span className={styles.arrow}>→</span>
    </Link>
  );
}
