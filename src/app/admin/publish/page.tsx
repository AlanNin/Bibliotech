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
import { redirect, useRouter } from "next/navigation";
import { addCopies, createBook } from "~/server/queries/book.queries";
import BookIlustration1 from "~/../public/assets/BookIlustration1.webp";
import BookIlustration2 from "~/../public/assets/BookIlustration2.webp";
import BookIlustration4 from "~/../public/assets/BookIlustration4.webp";
import Image from "next/image";
import ReactLoading from "react-loading";
import { toast } from "react-toastify";

interface Inputs {
  title: string;
}

export default function Publish() {
  const { user } = useUser();
  const router = useRouter();
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
  const [isPublishing, setIsPublishing] = useState<boolean>(false);

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
    physical_format: string,
    price: number,
    quantity: number,
    genres: any[]
  ) => {
    if (selectedBook) {
      setIsPublishing(true);
      const response = await createBook(
        isbn,
        title,
        author,
        editorial,
        edition_date,
        cover,
        rating,
        physical_format,
        price,
        quantity,
        genres
      );
      if (response.success === true) {
        toast.success("Book published successfully");
        setShowBooks(false);
        setStep(4);
        setSelectedBook(null);
        setBookEditions([]);
      } else {
        toast.error("Error publishing book");
      }
      setIsPublishing(false);
    }
  };

  const handleStepBack = () => {
    setBookEditions([]);
    setSelectedBook(null);
    setStep((prev) => prev - 1);
  };

  const handleAddCopies = async (isbn: string, quantity: number) => {
    if (selectedBook) {
      const response = await addCopies(isbn, quantity);
      if (response) {
        setShowBooks(false);
        setStep(4);
        setSelectedBook(null);
        setBookEditions([]);
      } else {
        //
      }
    }
  };

  useEffect(() => {
    if (selectedBook && selectedBook !== undefined && step !== 3) {
      const handleFetchBookEdition = async () => {
        const bookKey = selectedBook.key.split("/")[2];
        const response = await fetchBooksEdition(bookKey);
        setBookEditions(response.entries);
      };
      handleFetchBookEdition();
    }
  }, [selectedBook]);

  useEffect(() => {
    if (isPublishing) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isPublishing]);

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        {step === 1 && (
          <>
            <Image alt="bookIlustration" src={BookIlustration1} height={200} />
            <h1 className={styles.title}>Publish a new book</h1>
            <h1 className={styles.subTitle}>
              Search your book, choose an edition and set a price!
            </h1>
            <div className={styles.infoContainer}>
              <div className={styles.inputsContainer}>
                <Input
                  label="What is the title of your book?"
                  name="title"
                  placeholder="Book Name. Ex: The Little Prince"
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
            <Image
              alt="bookIlustration"
              src={BookIlustration2}
              height={200}
              className={styles.bookIlustration2}
            />
            <div className={styles.backButtonTitleContainer}>
              <ArrowLeftCircleIcon
                className={styles.backButtonIcon}
                onClick={handleStepBack}
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
            {isPublishing && (
              <div className={styles.isPublishingContainer}>
                <ReactLoading type="bars" color="#fff" height={70} width={70} />
              </div>
            )}
            <div className={styles.backButtonTitleContainer}>
              <ArrowLeftCircleIcon
                className={styles.backButtonIcon}
                onClick={handleStepBack}
              />
              <h1 className={styles.title}>Time to set a price</h1>
            </div>
            <h1 className={styles.subTitle}>
              Set a price for this book and publish it!
            </h1>
            <PriceModule
              selectedBook={selectedBook}
              handlePublish={handlePublish}
              handleAddCopies={handleAddCopies}
            />
          </>
        )}
        {step === 4 && (
          <>
            <div className={styles.publishedContainer}>
              <Image
                alt="bookIlustration"
                src={BookIlustration4}
                className={styles.bookIlustration4}
              />
              <h1 className={styles.publishedTitle}>
                Book Published Successfully!
              </h1>
              <div className={styles.publishedButtonsContainer}>
                <button
                  className={styles.goHomeButton}
                  onClick={() => router.push("/")}
                >
                  Go Home
                </button>
                <span className={styles.orSpan}> or </span>
                <button
                  className={styles.publishAnotherButton}
                  onClick={() => setStep(1)}
                >
                  Publish Another Book
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
