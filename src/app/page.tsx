"use client";
import styles from "./index.module.css";
import { getAllBooks } from "~/server/queries/book.queries";
import { useEffect, useState } from "react";
import { BookCard } from "./_home_components/bookCard";
import ReactLoading from "react-loading";

export default function Home() {
  const [books, setBooks] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(true);
    const fetchBooks = async () => {
      const response = await getAllBooks();
      setBooks(response);
      setIsLoading(false);
    };
    fetchBooks();
  }, []);

  return (
    <>
      {isLoading ? (
        <div className={styles.loadingContainer}>
          <ReactLoading type="spin" color="#2c94dd" height={70} width={70} />
        </div>
      ) : (
        <main className={styles.main}>
          <div className={styles.container}>
            <div className={styles.booksWrapper}>
              {books?.map((book: any) => (
                <BookCard key={book.key} book={book} />
              ))}
            </div>
          </div>
        </main>
      )}
    </>
  );
}
