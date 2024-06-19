"use client";
import styles from "./index.module.css";
import { getAllBooks } from "~/server/queries/book.queries";
import { useEffect, useState } from "react";
import { BookCard } from "./_home_components/bookCard";

export default function Home() {
  const [books, setBooks] = useState<any>();

  useEffect(() => {
    const fetchBooks = async () => {
      const response = await getAllBooks();
      setBooks(response);
    };
    fetchBooks();
  }, []);

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.booksWrapper}>
          {books?.map((book: any) => (
            <BookCard key={book.key} book={book} />
          ))}
        </div>
      </div>
    </main>
  );
}
