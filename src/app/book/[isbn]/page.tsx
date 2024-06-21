"use client";
import { useEffect, useState } from "react";
import styles from "./index.module.css";
import { useParams } from "next/navigation";
import { getBookByISBN } from "~/server/queries/book.queries";
import ReactLoading from "react-loading";

export default function Book() {
  const { isbn } = useParams();
  const [book, setBook] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  useEffect(() => {
    setIsLoading(true);
    const getBookInfo = async () => {
      if (typeof isbn === "string") {
        const response = await getBookByISBN(isbn);
        console.log(response);
        setBook(response);
      } else {
        console.error("Invalid isbn type:", isbn);
      }
      setIsLoading(false);
    };
    getBookInfo();
  }, [isbn]);

  const tipo_tapa =
    book?.TIPO_TAPA === "hardcover" ? "Tapa dura" : "Tapa blanda";

  return (
    <>
      {isLoading ? (
        <div className={styles.loadingContainer}>
          <ReactLoading type="spin" color="#2c94dd" height={70} width={70} />
        </div>
      ) : (
        <main className={styles.main}>
          <div className={styles.container}>
            <img
              alt="book cover"
              src={book?.IMAGEURL}
              className={styles.cover}
            />
            <div className={styles.bookInfo}>
              <div className={styles.title}>
                {book?.TITULO} <span> ({tipo_tapa})</span>
              </div>
              <div className={styles.author}>{book?.AUTOR}</div>
              <div className={styles.publisher}>{book?.EDITORIAL}</div>
              <div className={styles.year}>{book?.FECHA_EDICION}</div>
              <div className={styles.rating}>
                Rating: {book?.CALIFICACION}{" "}
                {Array.from(
                  { length: Math.floor(book?.CALIFICACION) },
                  (_, index) => (
                    <span key={index}>&#9733;</span>
                  )
                )}
              </div>
            </div>
          </div>
        </main>
      )}
    </>
  );
}
