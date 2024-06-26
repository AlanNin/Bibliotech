"use client";
import { useEffect, useState } from "react";
import styles from "./item.module.css";
import { getBookByID } from "~/server/queries/book.queries";
import ReactLoading from "react-loading";
import { DocumentTextIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
type OrderProps = {
  order: any;
};

export const Order: React.FC<OrderProps> = ({ order }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [book, setBook] = useState<any>();
  useEffect(() => {
    setIsLoading(true);
    const fetchBook = async () => {
      try {
        const response = await getBookByID(order?.ID_LIBRO);
        setBook(response);
      } catch (error) {
        console.error("Error fetching book:", error);
      }
    };
    fetchBook();
    setIsLoading(false);
  }, [order]);

  const bookImg = book?.IMAGEURL;
  const orderNumber = order?.ID_VENTAS;
  const title = book?.TITULO;
  const quantity = order?.CANTIDAD_LIBROS;
  const date = new Date(order?.FECHA_HORA);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "2-digit",
  };
  const formattedDate = date.toLocaleDateString("en-US", options);
  const shippment = order?.ENVIO;
  const price = order?.TOTAL;
  const paymentReference = order?.ID_STRIPE;

  return (
    <>
      {isLoading ? (
        <div className={styles.loadingContainer}>
          <ReactLoading type="bars" color="#2c94dd" height={70} width={70} />
        </div>
      ) : (
        <div className={styles.orderContainer}>
          <div className={styles.orderInfo}>
            <img src={bookImg} className={styles.bookCover} />
            <div className={styles.orderData}>
              <DocumentTextIcon
                className={styles.invoiceIcon}
                onClick={() => router.push(`/invoice/${order?.ID_STRIPE}`)}
              />
              <h1 className={styles.orderNumber}>Order #{orderNumber}</h1>
              <h1 className={styles.orderText}>{formattedDate}</h1>
              <h1 className={styles.orderText}>
                {title} x {quantity}
              </h1>
              <h1 className={styles.orderText}>Price: ${price}</h1>
              <h1 className={styles.orderText}>Shippement: {shippment}</h1>
              <h1 className={styles.orderText}>
                Payment Reference: {paymentReference}
              </h1>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
