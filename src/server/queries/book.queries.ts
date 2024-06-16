"use server";
import prisma from "../prismaClient";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

/*

  // Example
  type Book = {
    isbn: string;
    title: string;
    author: string;
    created_at: Date;
    updated_at: Date | null;
  };

  // GET ALL BOOKS
  export async function getAllBooks(): Promise<Book[]> {
    try {
      // FIND PROFILE
      const books = await prisma.books.findMany();

      // VALIDATE PROFILE AND USER
      if (!books || books.length === 0) {
        throw new Error("No books found");
      }

      return books;
    } catch (error) {
      throw new Error(`Failed to get books: ${error}`);
    }
  }

  // EXAMPLE OF AUTHMIDDLEWARE USAGE
  const user_id = await getUserFromAuth();

*/
