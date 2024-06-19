"use client";
import { use, useEffect, useState } from "react";
import { Input } from "../input/input";
import styles from "./priceModule.module.css";
import { bookExists } from "~/server/queries/book.queries";
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
    physical_format: string | "",
    price: number,
    quantity: number
  ) => void;
  handleAddCopies: (isbn: string, quantity: number) => void;
};

export const PriceModule: React.FC<PriceProps> = ({
  selectedBook,
  handlePublish,
  handleAddCopies,
}) => {
  const isbn = selectedBook?.isbn_13;
  const title = selectedBook?.title;
  const author =
    (selectedBook.author_name && selectedBook?.author_name[0]) || "";
  const editorial =
    (selectedBook.publishers && selectedBook?.publishers[0]) || "";
  const edition_date =
    (typeof selectedBook.publish_date === "string" &&
      selectedBook.publish_date.split(" ").pop()) ||
    "";
  const cover = selectedBook?.covers
    ? "https://covers.openlibrary.org/b/id/" + selectedBook.covers[0] + "-L.jpg"
    : selectedBook.cover_i
    ? "https://covers.openlibrary.org/b/id/" + selectedBook.cover_i + "-L.jpg"
    : "https://dummyimage.com/180x190/dedede/3b3b3b&text=Image+Not+Available";
  const rating = selectedBook?.ratings_average?.toFixed(1) || 0.0;
  const physical_format = selectedBook?.physical_format || "";

  const [isbnExists, setIsbnExists] = useState<boolean>(false);

  useEffect(() => {
    const checkBookExists = async (isbn: string) => {
      try {
        const response = await bookExists(isbn);
        console.log(response);
        if (response.success) {
          setIsbnExists(true);
        } else {
          setIsbnExists(false);
        }
      } catch (error) {
        console.error(error);
        setIsbnExists(false);
      }
    };

    checkBookExists(isbn);
  }, [isbn]);

  interface Inputs {
    price: number;
    quantity: number;
  }

  const [inputs, setInputs] = useState<Inputs>({
    price: 0,
    quantity: 0,
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setInputs({
      ...inputs,
      [name]: name === "price" || name === "quantity" ? Number(value) : value,
    });
  };

  const handleButtonClick = () => {
    if (isbnExists) {
      handleAddCopies(isbn, inputs.quantity);
    } else {
      handlePublish(
        isbn,
        title,
        author,
        editorial,
        edition_date,
        cover,
        rating,
        physical_format,
        inputs.price,
        inputs.quantity
      );
    }
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

          <p className={styles.bookRating}>
            Rating: {rating}{" "}
            {Array.from({ length: Math.floor(rating) }, (_, index) => (
              <span key={index}>&#9733;</span>
            ))}
          </p>
        </div>
      </div>
      <div className={styles.formContainter}>
        {!isbnExists && (
          <Input
            label="Price of the book"
            name="price"
            placeholder="$USD"
            handleChange={handleChange}
            format="decimal"
          />
        )}

        {isbnExists && (
          <h1 className={styles.existsTxt}>
            This book already exists, enter the number of copies you want to add
          </h1>
        )}

        <Input
          label="How many copies are you adding?"
          name="quantity"
          placeholder="Quantity"
          handleChange={handleChange}
          format="number"
        />
        <button className={styles.publishButton} onClick={handleButtonClick}>
          Publish
        </button>
      </div>
    </div>
  );
};
