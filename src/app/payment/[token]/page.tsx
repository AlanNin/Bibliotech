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
                <h1 className={styles.bookTitle}>
                  {book?.TITULO} x {data?.quantity}
                </h1>
                <h1 className={styles.bookTitle}>
                  Shippment: {data?.shippment}
                </h1>

                <h1 className={styles.bookPrice}>
                  ${formatPrice(book?.PRECIO * data?.quantity)}
                </h1>

                {book?.IMAGEURL && (
                  <img
                    className={styles.bookImage}
                    src={book?.IMAGEURL}
                    alt={book?.TITULO}
                  />
                )}
              </div>
              <Payment amount={book?.PRECIO * data?.quantity} />
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
