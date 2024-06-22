"use client";
import styles from "./index.module.css";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

export default function Book() {
  const router = useRouter();

  return (
    <div className={styles.main}>
      <div className={styles.container}>
        <CheckCircleIcon
          width={64}
          height={64}
          className={styles.checkCircleIcon}
        />
        <h1 className={styles.title}>Thanks for your payment Success</h1>
        <button className={styles.homeButton} onClick={() => router.push("/")}>
          Go to home
        </button>
      </div>
    </div>
  );
}
