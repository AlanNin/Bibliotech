"use client";
import styles from "./index.module.css";
import { getBooksHome } from "~/server/queries/book.queries";
import { useEffect, useState } from "react";
import ReactLoading from "react-loading";
import Slider from "./_shared/slider";

export default function Home() {
  const [books, setBooks] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(true);
    const fetchBooks = async () => {
      try {
        const response = await getBooksHome();
        setBooks(response);
      } catch (error) {
        console.error("Error fetching books:", error);
        // Manejar el error apropiadamente, como mostrar un mensaje al usuario
      } finally {
        setIsLoading(false);
      }
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
              <div className={styles.section}>
                <h1 className={styles.sectionTitle}>Most Sold Books</h1>
                {books.mostSold.length > 0 ? (
                  <Slider content={books.mostSold} />
                ) : (
                  <div className={styles.noBooks}>
                    <h2>No books found</h2>
                    <p>Try searching for a different book</p>
                  </div>
                )}
              </div>
              <div className={styles.section}>
                <h1 className={styles.sectionTitle}>Best Offers</h1>
                <Slider content={books.bestOffers} />
              </div>
              <div className={styles.section}>
                <h1 className={styles.sectionTitle}>Most Recent Books</h1>
                <Slider content={books.mostRecent} />
              </div>
              <div className={styles.section}>
                <h1 className={styles.sectionTitle}>Explore New Books</h1>
                <Slider content={books.random} />
              </div>
            </div>
          </div>
        </main>
      )}
    </>
  );
}
