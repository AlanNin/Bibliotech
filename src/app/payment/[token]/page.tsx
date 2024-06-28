"use client";
import { useEffect, useState } from "react";
import styles from "./index.module.css";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import ReactLoading from "react-loading";
import { getPaymentOrder } from "~/server/queries/payment.queries";
import { Payment } from "~/app/_shared/payment_components/payment";
import { getBookByISBN } from "~/server/queries/book.queries";
import AppLogo from "~/../public/assets/xdLogo.svg";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";

export default function Book() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const { token } = useParams();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [book, setBook] = useState<any>(null);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (!token) {
      router.push("/");
    }
  }, [token, router]);

  useEffect(() => {
    if (isLoaded && user && typeof token === "string") {
      const fetchPaymentOrder = async () => {
        try {
          setIsLoading(true);
          const response = await getPaymentOrder(token);
          if (response && response.userId === user.id) {
            setData(response);
            const bookResponse = await getBookByISBN(response.isbn);
            setBook(bookResponse);
          } else {
            router.push("/");
          }
        } catch (error) {
          console.error("Error fetching payment order:", error);
          router.push("/");
        } finally {
          setIsLoading(false);
        }
      };
      fetchPaymentOrder();
    }
  }, [token, user, isLoaded]);

  const subTotal = book?.PRECIO * data?.quantity;
  const iva = subTotal * 0.04;
  const total = subTotal + iva;

  const paymentData = {
    shippment: data?.shippment,
    address: undefined,
    country: undefined,
    city: undefined,
    postalCode: undefined,
    bookQuantity: data?.quantity,
    iva: iva,
    subTotal: subTotal,
    total: total,
    bookId: book?.ID_LIBRO,
  };

  return (
    <>
      {isLoading ? (
        <div className={styles.loadingContainer}>
          <ReactLoading type="spin" color="#2c94dd" height={70} width={70} />
        </div>
      ) : (
        <main className={styles.main}>
          {user?.id === data?.userId && (
            <div className={styles.container}>
              <div className={styles.productInfoDiv}>
                <div className={styles.LogoDiv}>
                  <Image src={AppLogo} alt="xdLogo" className={styles.Logo} />
                  <h1 className={styles.appName}>Bibliotech</h1>
                </div>

                <div className={styles.sellInfo}>
                  <h1 className={styles.bookTitle}>
                    {book?.TITULO} x {data?.quantity}
                  </h1>
                  <h1 className={styles.bookLabel}>
                    Shippment: {data?.shippment}
                  </h1>
                  <h1 className={styles.bookLabel}>
                    Subtotal: ${formatPrice(subTotal)}
                  </h1>

                  <h1 className={styles.bookLabel}>IVA: ${formatPrice(iva)}</h1>
                </div>

                <h1 className={styles.bookLabelTotal}>Total (USD):</h1>
                <h1 className={styles.bookPrice}>${formatPrice(total)}</h1>

                {book?.IMAGEURL && (
                  <img
                    className={styles.bookImage}
                    src={book?.IMAGEURL}
                    alt={book?.TITULO}
                  />
                )}
              </div>
              <Payment paymentData={paymentData} />
            </div>
          )}
        </main>
      )}
    </>
  );
}

function formatPrice(number: number): string {
  return number
    .toLocaleString("en-US", { style: "currency", currency: "USD" })
    .replace("$", "");
}
