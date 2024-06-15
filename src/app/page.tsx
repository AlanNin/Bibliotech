import Link from "next/link";

import styles from "./index.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>
          This is <span className={styles.pinkSpan}>Bibliotech :|</span>
        </h1>
      </div>
    </main>
  );
}
