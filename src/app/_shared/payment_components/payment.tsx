"use client";
import styles from "./payment.module.css";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import convertToSubcurrency from "./convertToSubcurrency";
import CheckoutPage from "./checkout";

if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined");
}

const stripe = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

type PaymentProps = {
  paymentData: any;
};

export const Payment: React.FC<PaymentProps> = ({ paymentData }) => {
  return (
    <div className={styles.container}>
      <Elements
        stripe={stripe}
        options={{
          mode: "payment",
          amount: convertToSubcurrency(paymentData.total),
          currency: "usd",
        }}
      >
        <CheckoutPage paymentData={paymentData} />
      </Elements>
    </div>
  );
};
