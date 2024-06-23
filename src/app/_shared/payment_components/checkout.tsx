"use client";
import styles from "./checkout.module.css";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import convertToSubcurrency from "./convertToSubcurrency";
import { ProcessPaymentIntent } from "~/server/APIs/Stripe.api";
import ReactLoading from "react-loading";
import { createSell, deleteSell } from "~/server/queries/sell.queries";
import { useRouter } from "next/navigation";

type CheckOutProps = {
  paymentData: any;
};

export const CheckoutPage: React.FC<CheckOutProps> = ({ paymentData }) => {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [clientSecret, setClientSecret] = useState("");
  const [createdSell, setCreatedSell] = useState<any>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPaymentIntent = async () => {
      const paymentIntent = await ProcessPaymentIntent(
        convertToSubcurrency(paymentData.total)
      );
      if (
        paymentIntent.success === true &&
        paymentIntent.clientSecret !== null
      ) {
        setClientSecret(paymentIntent.clientSecret);
      }
    };

    fetchPaymentIntent();
  }, [paymentData]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      return;
    }

    const { error: submitError } = await elements.submit();

    if (submitError) {
      setErrorMessage(submitError.message);
      setLoading(false);
      return;
    }

    try {
      const sell = await createSell(
        paymentData.shippment,
        paymentData.address,
        paymentData.country,
        paymentData.city,
        paymentData.postalCode,
        paymentData.bookQuantity,
        paymentData.iva,
        paymentData.subTotal,
        paymentData.total,
        clientSecret,
        paymentData.bookId
      );

      setCreatedSell(sell);

      router.push(
        `${window.location.origin}/payment-success?amount=${paymentData.total}`
      );
    } catch (error) {
      setErrorMessage("Error processing payment");
    }

    const { error } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `${window.location.origin}/payment-success?amount=${paymentData.total}`,
      },
    });

    if (error) {
      // This point is only reached if there's an immediate error when
      // confirming the payment. Show the error to your customer (for example, payment details incomplete)
      await deleteSell(createdSell?.ID_VENTAS);
      setErrorMessage(error.message);
    } else {
      // The payment UI automatically closes with a success animation.
      // Your customer is redirected to your `return_url`.
    }

    setLoading(false);
  };

  if (!clientSecret || !stripe || !elements) {
    return (
      <div className={styles.container}>
        <div className={styles.paymentDiv} role="status">
          <ReactLoading type="bars" color="black" height={70} width={70} />
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {clientSecret && <PaymentElement />}

      {errorMessage && <div>{errorMessage}</div>}

      <button disabled={!stripe || loading} className={styles.paymentButton}>
        {!loading ? `Pay Now` : "Processing..."}
      </button>
    </form>
  );
};

export default CheckoutPage;
