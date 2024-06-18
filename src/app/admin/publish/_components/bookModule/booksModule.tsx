"use client";
import styles from "./booksModule.module.css";
import ReactLoading from "react-loading";
import { BookItem } from "../book/book";
type BookProps = {
  books: any[];
  handleSelectBook(book: any): void;
};

export const BooksModule: React.FC<BookProps> = ({
  books,
  handleSelectBook,
}) => {
  return (
    <div className={styles.booksContainer}>
      {books.length === 0 ? (
        <ReactLoading type="bars" color="white" height={30} width={30} />
      ) : (
        <div className={styles.booksModule}>
          {books.map((book: any) => (
            <BookItem
              key={book.key}
              book={book}
              handleSelectBook={handleSelectBook}
            />
          ))}
        </div>
      )}
    </div>
  );
};
