"use client";
import styles from "./bookCard.module.css";

type BookProps = {
  book: any;
};

export const BookCard: React.FC<BookProps> = ({ book }) => {
  return (
    <div className={styles.bookContainer}>
      <img src={book.IMAGEURL} alt="book cover" className={styles.bookCover} />
    </div>
  );
};
