"use client";
import {
  CheckCircleIcon,
  HomeIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import styles from "./index.module.css";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useEffect, useRef, useState } from "react";
import Invoice from "../_shared/invoice";
import { getSellByStripeId } from "~/server/queries/sell.queries";
import { useSearchParams } from "next/navigation";
import { getBookByID } from "~/server/queries/book.queries";
import ReactLoading from "react-loading";

export default function Book(): JSX.Element {
  const router = useRouter();
  const invoiceRef = useRef(null);
  const [invoiceData, setInvoiceData] = useState<any>(null);
  const searchParams = useSearchParams();
  const payment_intent = searchParams.get("payment_intent_client_secret");
  const date = new Date(invoiceData?.FECHA_HORA);
  const formattedDate = date.toLocaleDateString("en-US");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const handleGenerateInvoicePDF = async () => {
    const inputData = invoiceRef.current;
    try {
      if (!inputData) {
        throw new Error("No input data provided");
      }

      const canvas = await html2canvas(inputData, {
        scale: 1,
        useCORS: true,
        logging: true,
      });

      const imgData = canvas.toDataURL("image/jpeg", 5);

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: [canvas.width * 0.65, canvas.height * 0.65],
      });

      const width = pdf.internal.pageSize.getWidth();
      const height = (canvas.height * width) / canvas.width;

      pdf.addImage(imgData, "JPEG", 0, 0, width, height);
      pdf.save(`Invoice_${invoiceData?.ID_VENTAS}_${formattedDate}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      // Handle error
    }
  };

  useEffect(() => {
    setIsLoading(true);
    const handleFetchPaymentData = async () => {
      if (typeof payment_intent === "string") {
        const response = await getSellByStripeId(payment_intent);
        const bookInfo = await getBookByID(response.ID_LIBRO);
        setInvoiceData({ ...response, bookInfo });
        setIsLoading(false);
      } else {
        console.error("Invalid payment_intent:", payment_intent);
      }
    };
    handleFetchPaymentData();
  }, [payment_intent]);

  return (
    <>
      {isLoading ? (
        <div className={styles.loadingContainer}>
          <ReactLoading type="spin" color="#2c94dd" height={70} width={70} />
        </div>
      ) : (
        <div className={styles.main}>
          <div className={styles.container}>
            <CheckCircleIcon
              width={64}
              height={64}
              className={styles.checkCircleIcon}
            />
            <h1 className={styles.title}>Thanks for your purchase!</h1>
            <div className={styles.buttonsContainer}>
              <button
                className={styles.button}
                onClick={() => router.push("/")}
              >
                <HomeIcon width={28} height={28} />
                Go Home
              </button>

              <button
                className={styles.invoiceButton}
                onClick={handleGenerateInvoicePDF}
              >
                <ArrowDownTrayIcon width={16} height={16} />
                <span className={styles.invoiceButtonText}>
                  Download Invoice as PDF
                </span>
              </button>
            </div>
          </div>
          <div className={styles.invoiceContainer}>
            <div ref={invoiceRef} className={styles.PDFContainer}>
              <Invoice invoiceData={invoiceData} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
