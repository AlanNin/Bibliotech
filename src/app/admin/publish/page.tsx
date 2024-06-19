"use client";
import styles from "./index.module.css";
import { useEffect, useState } from "react";
import { Input } from "./_components/input/input";
import {
  fetchBooksByTitle,
  fetchBooksEdition,
} from "~/server/APIs/OpenLibray.api";
import { BooksModule } from "./_components/bookModule/booksModule";
import { EditionsModule } from "./_components/editionModule/editionsModule";
import { ArrowLeftCircleIcon } from "@heroicons/react/24/outline";
import { PriceModule } from "./_components/priceModule/priceModule";
import { useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { createBook } from "~/server/queries/book.queries";

interface Inputs {
  title: string;
}

export default function Publish() {
  const { user } = useUser();
  if (user?.publicMetadata.role !== "admin") {
    redirect("/");
  }
  const [inputs, setInputs] = useState<Inputs>({
    title: "",
  });
  const [step, setStep] = useState<number>(1);
  const [showBooks, setShowBooks] = useState<boolean>(false);
  const [books, setBooks] = useState<any[]>([]);
  const [selectedBook, setSelectedBook] = useState<any>();
  const [bookEditions, setBookEditions] = useState<any[]>([]);

  const handleSelectBook = (book: any) => {
    if (step === 1) {
      setSelectedBook(book);
      setShowBooks(false);
      setStep(2);
    } else if (step === 2) {
      setSelectedBook((prevSelectedBook: any) => ({
        ...prevSelectedBook,
        ...book,
      }));
      setStep(3);
    }
  };

  const handleChange = (e: any) => {
    setInputs((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const handleSearch = async () => {
    if (inputs.title.length > 0) {
      setBooks([]);
      setShowBooks(true);
      const response = await fetchBooksByTitle(inputs.title);
      setBooks(response.docs);
    } else {
      setShowBooks(false);
    }
  };

  const handlePublish = async (
    isbn: string,
    title: string,
    author: string,
    editorial: string,
    edition_date: string,
    cover: string,
    rating: number,
    price: number,
    quantity: number
  ) => {
    if (selectedBook) {
      const response = await createBook(
        isbn,
        title,
        author,
        editorial,
        edition_date,
        cover,
        rating
      );
      if (response.success === true) {
        setShowBooks(false);
        setStep(1);
        setSelectedBook(null);
        setBookEditions([]);
      } else {
        //
      }
    }
  };

  useEffect(() => {
    if (selectedBook !== undefined && step !== 3) {
      const handleFetchBookEdition = async () => {
        const bookKey = selectedBook.key.split("/")[2];
        const response = await fetchBooksEdition(bookKey);
        setBookEditions(response.entries);
      };
      handleFetchBookEdition();
    }
  }, [selectedBook]);

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        {step === 1 && (
          <>
            <h1 className={styles.title}>Publish a new book</h1>
            <h1 className={styles.subTitle}>
              Search your book, choose an edition and set a price!
            </h1>
            <div className={styles.infoContainer}>
              <div className={styles.inputsContainer}>
                <Input
                  label="What book are you selling?"
                  name="title"
                  placeholder="Book Name. Ex: The Great Gatsby"
                  handleChange={handleChange}
                  handleSearch={handleSearch}
                  search={true}
                />
              </div>
            </div>
            {showBooks && (
              <BooksModule books={books} handleSelectBook={handleSelectBook} />
            )}
          </>
        )}
        {step === 2 && (
          <>
            <div className={styles.backButtonTitleContainer}>
              <ArrowLeftCircleIcon
                className={styles.backButtonIcon}
                onClick={() => setStep(1)}
              />
              <h1 className={styles.title}>Find your book edition</h1>
            </div>
            <h1 className={styles.subTitle}>
              Explore the different editions of your book and choose the one
            </h1>
            <EditionsModule
              books={bookEditions}
              handleSelectBook={handleSelectBook}
            />
          </>
        )}
        {step === 3 && (
          <>
            <div className={styles.backButtonTitleContainer}>
              <ArrowLeftCircleIcon
                className={styles.backButtonIcon}
                onClick={() => setStep(2)}
              />
              <h1 className={styles.title}>Time to set a price</h1>
            </div>
            <h1 className={styles.subTitle}>
              Set a price for this book and publish it!
            </h1>
            <PriceModule
              selectedBook={selectedBook}
              handlePublish={handlePublish}
            />
          </>
        )}
      </div>
    </main>
  );
}
