"use client";
import { useState } from "react";
import styles from "./index.module.css";
import { useRouter } from "next/navigation";
import OpenLibraryLogo from "~/../public/assets/OpenLibraryLogo.png";
import Image from "next/image";

type BookProps = {
  book: any;
};

export const BookCard: React.FC<BookProps> = ({ book }) => {
  const router = useRouter();
  const [isHover, setIsHover] = useState<boolean>(false);

  return (
    <div
      className={styles.bookContainer}
      onClick={() => router.push("/book/" + book?.ISBN)}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <img src={book?.IMAGEURL} alt="book cover" className={styles.bookCover} />
      {isHover && (
        <div className={styles.hoverContainer}>
          <p className={styles.price}>${book?.PRECIO}</p>
          <Image
            src={OpenLibraryLogo}
            alt="OpenLibraryLogo"
            className={styles.openLibraryLogo}
          />
          <h1 className={styles.rating}>
            {Array.from({ length: 5 }, (_, index) => (
              <span
                key={index}
                className={`${styles.star} ${
                  index < Math.floor(book?.CALIFICACION)
                    ? styles.yellowStar
                    : styles.greyStar
                }`}
              >
                &#9733;
              </span>
            ))}
          </h1>
        </div>
      )}
    </div>
  );
};
