"use server";
import Stripe from "stripe";

const stripeKey = process.env.STRIPE_SECRET_KEY;

if (typeof stripeKey !== "string") throw new Error("Stripe key not found");

export const ProcessPaymentIntent = async (amount: number) => {
  const stripe = new Stripe(stripeKey!);

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
    });

    return { success: true, clientSecret: paymentIntent.client_secret };
  } catch (error) {
    console.error("Internal Error:", error);
    return { error: `Internal Server Error: ${error}`, status: 500 };
  }
};
