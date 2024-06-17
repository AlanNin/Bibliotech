"use client";
import styles from "./book.module.css";
import ReactLoading from "react-loading";

type BookProps = {
  book: any;
};

export const BookItem: React.FC<BookProps> = ({ book }) => {
  return (
    <div className={styles.bookContainer}>
      <img
        src={
          book.cover_i
            ? "https://covers.openlibrary.org/b/id/" + book.cover_i + "-L.jpg"
            : "https://dummyimage.com/180x190/dedede/3b3b3b&text=Image+Not+Available"
        }
        alt="book cover"
        className={styles.bookCover}
      />
      <div className={styles.bookInfoContainer}>
        <h1 className={styles.bookTitle}>{book.title}</h1>
        <p className={styles.bookAuthor}>Author: {book.author_name[0]}</p>

        <p className={styles.bookGenres}>
          Genres:{" "}
          {book.subject &&
            book.subject.slice(0, 4).map((subject: any, index: number) => (
              <span key={index}>
                {index > 0 && index < 3 ? ", " : index === 3 ? " & " : ""}
                {subject?.charAt(0).toUpperCase() + subject?.slice(1)}
              </span>
            ))}
        </p>

        <p className={styles.bookAuthor}>
          Rating: {book.ratings_average.toFixed(2)}{" "}
          {Array.from(
            { length: Math.floor(book.ratings_average) },
            (_, index) => (
              <span key={index}>&#9733;</span>
            )
          )}
        </p>
      </div>
    </div>
  );
};
