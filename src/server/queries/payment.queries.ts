"use server";
import jwt from "jsonwebtoken";

export async function createPaymentOrder(
  isbn: string,
  quantity: number,
  selectedOption: string
) {
  try {
    const token = jwt.sign(
      {
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
