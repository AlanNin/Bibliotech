"use client";
import { useEffect, useState } from "react";
import styles from "./index.module.css";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import ReactLoading from "react-loading";
import { getPaymentOrder } from "~/server/queries/payment.queries";
import { Payment } from "~/app/book/_payment_components/payment";
import { getBookByISBN } from "~/server/queries/book.queries";
import AppLogo from "~/../public/assets/xdLogo.png";
import Image from "next/image";

export default function Book() {
  const router = useRouter();
  const { token } = useParams();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [book, setBook] = useState<any>();
  const [data, setData] = useState<any>();
  useEffect(() => {
    setIsLoading(true);
    if (typeof token === "string") {
      const fetchPaymentOrder = async () => {
        const response = await getPaymentOrder(token);
        setData(response);
        const bookResponse = await getBookByISBN(response.isbn);
        setBook(bookResponse);
        setIsLoading(false);
      };
      fetchPaymentOrder();
    }
  }, [token]);

  return (
    <>
      {isLoading ? (
        <div className={styles.loadingContainer}>
          <ReactLoading type="spin" color="#2c94dd" height={70} width={70} />
        </div>
      ) : (
        <main className={styles.main}>
          <div className={styles.container}>
            <div className={styles.productInfoDiv}>
              <div className={styles.LogoDiv}>
                <Image src={AppLogo} alt="xdLogo" className={styles.Logo} />
                <h1 className={styles.appName}> Bibliotech </h1>
              </div>
              <h1 className={styles.bookTitle}>
                {book.TITULO} x {data.quantity}
              </h1>
              <h1 className={styles.bookTitle}>Shippment: {data.shippment}</h1>

              <h1 className={styles.bookPrice}>
                ${formatPrice(book.PRECIO * data.quantity)}
              </h1>

              <img className={styles.bookImage} src={book?.IMAGEURL} />
            </div>
            <Payment amount={book?.PRECIO * data.quantity} />
          </div>
        </main>
      )}
    </>
  );
}

function formatPrice(number: number): string {
  const numberString = number.toString();
  return parseFloat(numberString)
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
