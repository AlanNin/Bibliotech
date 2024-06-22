"use server";
import jwt from "jsonwebtoken";
import { auth } from "@clerk/nextjs/server";

export async function createPaymentOrder(
  isbn: string,
  quantity: number,
  selectedOption: string
) {
  try {
    const { userId } = auth();
    const token = jwt.sign(
      {
        userId,
        isbn,
        quantity,
        shippment: selectedOption,
      },
      process.env.JWT_SECRET || "",
      {
        expiresIn: "1h",
      }
    );

    return token;
  } catch (error) {
    //
  }
}

export async function getPaymentOrder(token: string) {
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET || "") as any;

    return data;
  } catch (error) {
    //
  }
}
