"use client";
import styles from "./index.module.css";
import { getBookByNameService } from "~/server/queries/book.queries";
import { useEffect, useState } from "react";
import { BookCard } from "~/app/_shared/book_card";
import ReactLoading from "react-loading";
import { FaceFrownIcon } from "@heroicons/react/24/outline";
import { useSearchParams } from "next/navigation";

export default function Home() {
  const [books, setBooks] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const searchParams = useSearchParams();
  const toLook = searchParams.get("q");
  useEffect(() => {
    setIsLoading(true);
    const fetchBooks = async () => {
      if (typeof toLook === "string") {
        const response = await getBookByNameService(toLook);

        setBooks(response);
      } else {
        console.error("Invalid book:", toLook);
      }
      setIsLoading(false);
    };

    fetchBooks();
  }, [toLook]);

  return (
    <>
      {isLoading ? (
        <div className={styles.loadingContainer}>
          <ReactLoading type="spin" color="#2c94dd" height={70} width={70} />
        </div>
      ) : (
        <>
          {books?.length > 0 ? (
            <main className={styles.main}>
              <div className={styles.container}>
                <h1 className={styles.title}>
                  Results for: <span className={styles.span}>{toLook}</span>
                </h1>
                <div className={styles.booksWrapper}>
                  {books?.map((book: any) => (
                    <BookCard key={book.key} book={book} />
                  ))}
                </div>
              </div>
            </main>
          ) : (
            <main className={styles.main}>
              <div className={styles.containerNotFound}>
                <h1 className={styles.title}>
                  No results found for this query
                </h1>
                <FaceFrownIcon className={styles.icon} />
              </div>
            </main>
          )}
        </>
      )}
    </>
  );
}
