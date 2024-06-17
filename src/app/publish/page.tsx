"use client";
import styles from "./index.module.css";
import { useState } from "react";
import { Input } from "./_components/input/input";
import { fetchBooksByTitle } from "~/server/APIs/OpenLibray.api";
import { BooksModule } from "./_components/book/booksModule";

export default function Publish() {
  interface Inputs {
    title: string;
  }

  const [inputs, setInputs] = useState<Inputs>({
    title: "",
  });

  const [showBooks, setShowBooks] = useState<boolean>(false);
  const [books, setBooks] = useState<any[]>([]);

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

  return (
    <main className={styles.main}>
      <div className={styles.container}>
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
            />
          </div>
        </div>
        {showBooks && <BooksModule books={books} />}
      </div>
    </main>
  );
}
