"use client";
import { useEffect, useState } from "react";
import styles from "./index.module.css";
import { useParams } from "next/navigation";
import { getBookByISBN } from "~/server/queries/book.queries";
import { useRouter } from "next/navigation";
import ReactLoading from "react-loading";
import GoodReadsLogo from "~/../public/assets/GoodreadsLogo.png";
import Image from "next/image";

export default function Book() {
  const router = useRouter();
  const { isbn } = useParams();
  const [book, setBook] = useState<any>();
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  useEffect(() => {
    setIsLoading(true);
    const getBookInfo = async () => {
      if (typeof isbn === "string") {
        const response = await getBookByISBN(isbn);
        if (response) {
          const genres = response.Libro_Genero.map(
            (libroGenero) => libroGenero.genero
          );
          setBook({
            ...response,
            genres,
          });
        } else {
          console.error("Book not found");
        }
      } else {
        console.error("Invalid isbn type:", isbn);
      }
      setIsLoading(false);
    };
    getBookInfo();
  }, [isbn]);

  const tipo_tapa = book?.TIPO_TAPA === "hardcover" ? "Hardcover" : "Paperback";

  const [selectedOption, setSelectedOption] = useState<string>("Delivery");

  const handleQuantityChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setQuantity(parseInt(event.target.value, 10));
  };

  const quantityOptions = [];
  for (let i = 1; i <= book?.CANTIDAD_LIBROS; i++) {
    quantityOptions.push(
      <option key={i} value={i}>
        {i}
      </option>
    );
  }

  return (
    <>
      {isLoading ? (
        <div className={styles.loadingContainer}>
          <ReactLoading type="spin" color="#2c94dd" height={70} width={70} />
        </div>
      ) : (
        <main className={styles.main}>
          <div className={styles.container}>
            <img
              alt="book cover"
              src={book?.IMAGEURL}
              className={styles.cover}
            />
            <div className={styles.bookInfo}>
              <h1 className={styles.title}>
                {book?.TITULO}{" "}
                <span className={styles.bookType}>({tipo_tapa})</span>
              </h1>
              <h1 className={styles.AuthorEditorialText}>
                By
                <a className={styles.AuthorEditorialNameSpan}>
                  {" "}
                  {book?.AUTOR}{" "}
                </a>
                <span className={styles.AuthorEditorialJobSpan}>(Author)</span>{" "}
                &{" "}
                <span className={styles.AuthorEditorialNameSpan}>
                  {book?.EDITORIAL}
                </span>{" "}
                <span className={styles.AuthorEditorialJobSpan}>
                  (Editorial)
                </span>
              </h1>

              {book?.CALIFICACION > 0 ? (
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
                  ))}{" "}
                  {parseFloat(book.CALIFICACION)
                    .toFixed(2)
                    .replace(/\.?0*$/, "")}{" "}
                  Stars - OpenLibrary Community
                </h1>
              ) : (
                <h1 className={styles.rating}>No rating found for this book</h1>
              )}

              <div className={styles.year}>
                First published on {book?.FECHA_EDICION}
              </div>

              <div className={styles.bookGenresContainer}>
                <span className={styles.genresLabel}>Genres:</span>
                {book?.genres?.slice(0, 15).map((genre: any, index: number) => (
                  <span key={index} className={styles.genre}>
                    {genre.NOMBRE_GENERO}
                  </span>
                ))}
              </div>

              <button
                className={styles.goodreadsButton}
                onClick={() => {
                  router.push(
                    `https://www.goodreads.com/book/isbn/${book?.ISBN}`
                  );
                }}
              >
                Find this book on Goodreads{" "}
                <Image
                  src={GoodReadsLogo}
                  alt="Goodreads Logo"
                  width={24}
                  height={24}
                />
              </button>
            </div>
            <div className={styles.paymentInfoContainer}>
              <div className={styles.shippementOptionContainer}>
                <button
                  className={`${styles.shippementOptionButton} ${
                    selectedOption === "Delivery" ? styles.selected : ""
                  }`}
                  onClick={() => setSelectedOption("Delivery")}
                >
                  Delivery
                </button>
                <button
                  className={`${styles.shippementOptionButton} ${
                    selectedOption === "Pickup" ? styles.selected : ""
                  }`}
                  onClick={() => setSelectedOption("Pickup")}
                >
                  Pickup
                </button>
              </div>
              <div className={styles.priceContainer}>
                <div className={styles.price}>
                  <span className={styles.priceIcon}>$</span>
                  <span className={styles.priceLabel}>
                    {getPriceInteger(book?.PRECIO)}
                  </span>
                  <span className={styles.priceCentsLabel}>
                    {getPriceCents(book?.PRECIO)}
                  </span>
                  <span className={styles.priceRD}>
                    (RD: {formatPriceToRD(book?.PRECIO || 0)})
                  </span>
                </div>

                <h1 className={styles.deliveryLabel}>
                  Will be delivered on
                  <span className={styles.deliveryDate}>
                    {" "}
                    Monday, June 2024
                  </span>
                </h1>

                <h1 className={styles.stock}>In Stock</h1>
                <h1 className={styles.discount}>Buy 4 or more, save 5%</h1>

                <div className={styles.quantityContainer}>
                  <h1 className={styles.quantityLabel}>Quantity:</h1>
                  <select
                    value={quantity}
                    onChange={handleQuantityChange}
                    className={styles.quantitySelect}
                  >
                    {quantityOptions}
                  </select>
                </div>

                <button className={styles.buyButton}> Buy Now</button>
              </div>
            </div>
          </div>
        </main>
      )}
    </>
  );
}

function getPriceInteger(price: number) {
  if (!price) return "";
  const [integerPart, decimalPart] = price.toString().split(".");
  return integerPart;
}
function getPriceCents(price: number) {
  if (!price) return "";
  const [integerPart, decimalPart] = price.toString().split(".");
  return decimalPart ? `${decimalPart}` : "";
}

function formatPrice(number: number): string {
  const numberString = number.toString();
  return parseFloat(numberString)
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function formatPriceToRD(number: number): string {
  const multipliedNumber = number * 59;
  const numberString = multipliedNumber.toString();
  return parseFloat(numberString)
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
