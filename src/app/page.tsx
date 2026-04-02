import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Portföy Takip</h1>
      <p className={styles.subtitle}>Varlıklarınızı takip edin</p>
    </main>
  );
}
