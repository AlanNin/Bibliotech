"use client";
import styles from "./index.module.css";
import { getAllBooks, getBooksByGenreService } from "~/server/queries/book.queries";
import { useEffect, useState } from "react";
import { BookCard } from "~/app/_home_components/bookCard";
import ReactLoading from "react-loading";

import { useParams } from "next/navigation";

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
