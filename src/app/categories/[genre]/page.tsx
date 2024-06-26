"use client";
import styles from "./index.module.css";
import { getBooksByGenreService } from "~/server/queries/book.queries";
import { useEffect, useState } from "react";
import { BookCard } from "~/app/_shared/book_card";
import ReactLoading from "react-loading";

import { useParams } from "next/navigation";
import { FaceFrownIcon } from "@heroicons/react/24/outline";

export default function Home() {
  const [books, setBooks] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { genre } = useParams();
  useEffect(() => {
    setIsLoading(true);
    const fetchBooks = async () => {
      if (typeof genre === "string") {
        const response = await getBooksByGenreService(genre);

        setBooks(response);
      } else {
        console.error("Invalid genre:", genre);
      }
      setIsLoading(false);
    };

    fetchBooks();
  }, [genre]);

  const formattedGenre = Array.isArray(genre) ? genre[0] : genre;
  const formattedTitle = formattedGenre
    ? formattedGenre.charAt(0).toUpperCase() + formattedGenre.slice(1)
    : "";

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
                <h1 className={styles.categoryTitle}>
                  Books related to{" "}
                  <span className={styles.categoryTitleSpan}>
                    {formattedTitle}
                  </span>
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
