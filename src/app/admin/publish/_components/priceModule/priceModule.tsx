"use client";
import { use, useEffect, useState } from "react";
import { Input } from "../input/input";
import styles from "./priceModule.module.css";
type PriceProps = {
  selectedBook: any;
  handlePublish: (
    isbn: string,
    title: string,
    author: string,
    editorial: string,
    edition_date: string,
    cover: string,
    rating: number,
    price: number,
    quantity: number
  ) => void;
};

export const PriceModule: React.FC<PriceProps> = ({
  selectedBook,
  handlePublish,
}) => {
  const isbn = selectedBook?.isbn_13;
  const title = selectedBook?.title;
  const author = selectedBook?.author_name[0];
  const editorial = selectedBook?.publishers[0];
  const edition_date = selectedBook?.publish_date.split(" ").pop();
  const cover = selectedBook?.covers
    ? "https://covers.openlibrary.org/b/id/" + selectedBook.covers[0] + "-L.jpg"
    : selectedBook.cover_i
    ? "https://covers.openlibrary.org/b/id/" + selectedBook.cover_i + "-L.jpg"
    : "https://dummyimage.com/180x190/dedede/3b3b3b&text=Image+Not+Available";
  const rating = selectedBook?.ratings_average?.toFixed(1);

  interface Inputs {
    price: number;
    quantity: number;
  }

  const [inputs, setInputs] = useState<Inputs>({
    price: 0,
    quantity: 0,
  });

  const handleChange = (e: any) => {
    setInputs((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.bookContainer}>
        <img src={cover} alt="book cover" className={styles.bookCover} />
        <div className={styles.bookInfoContainer}>
          <h1 className={styles.bookTitle}>{title}</h1>

          {isbn && <p className={styles.bookInfoGeneral}>ISBN: {isbn}</p>}

          <p className={styles.bookInfoGeneral}>
            Author: {author?.charAt(0).toUpperCase() + author?.slice(1)}
          </p>

          {editorial && (
            <p className={styles.bookGenres}>
              Editorial:{" "}
              {editorial?.charAt(0).toUpperCase() + editorial?.slice(1)}
            </p>
          )}

          {edition_date && (
            <p className={styles.bookInfoGeneral}>
              Edition Date: {edition_date}
            </p>
          )}

          {rating && (
            <p className={styles.bookRating}>
              Rating: {rating}{" "}
              {Array.from({ length: Math.floor(rating) }, (_, index) => (
                <span key={index}>&#9733;</span>
              ))}
            </p>
          )}
        </div>
      </div>
      <div className={styles.formContainter}>
        <Input
          label="Price of the book"
          name="price"
          placeholder="$USD"
          handleChange={handleChange}
          format="decimal"
        />
        <Input
          label="How many copies are you adding?"
          name="quantity"
          placeholder="Quantity"
          handleChange={handleChange}
          format="number"
        />
        <button
          className={styles.publishButton}
          onClick={() =>
            handlePublish(
              isbn,
              title,
              author,
              editorial,
              edition_date,
              cover,
              rating,
              inputs.price,
              inputs.quantity
            )
          }
        >
          Publish
        </button>
      </div>
    </div>
  );
};
