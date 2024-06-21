"use client";
import styles from "./bookCard.module.css";
import { useRouter } from "next/navigation";

type BookProps = {
  book: any;
};

export const BookCard: React.FC<BookProps> = ({ book }) => {
  const router = useRouter();
  console.log(book);
  return (
    <div
      className={styles.bookContainer}
      onClick={() => router.push("/book/" + book.ISBN)}
    >
      <img src={book.IMAGEURL} alt="book cover" className={styles.bookCover} />
    </div>
  );
};
