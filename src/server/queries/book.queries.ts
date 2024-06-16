"use server";
import prisma from "../prismaClient";
//import bcrypt from "bcrypt";
//import jwt from "jsonwebtoken";

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

//creating a book 
export async function createBookService(
  isbn: string,
  titulo: string,
  autor: string, 
  editorial: string,
  fecha_edicion: string, 
  imageurl: string,
  calificacion: any
) {
  try {

      //Using prisma to create a book
      const createdBook = await prisma.libro.create({
          data: {
              ISBN: isbn,
              TITULO: titulo,
              AUTOR: autor,
              EDITORIAL: editorial,
              FECHA_EDICION: fecha_edicion,
              IMAGEURL: imageurl,
              CALIFICACION: calificacion
          }
      });

      return createdBook;
  } catch (error: any) {
      throw new Error(error);
  }
}

//Getting all of the database books
export async function getAllBooksService(){
  try {
      //Using prisma "findMany" to get all books
      const requestedBooks = await prisma.libro.findMany();
      return requestedBooks;
      
  } catch (error: any) {
      console.error("Error fetching books:", error);
      throw new Error("Unable to fetch books. Please try again later.");
  }
}

//Getting one specific book by id
export async function getBookService(id: number) 
{
  try {
      //with findUnique you can search for "Unique" denominated fields on prisma schema
      const requestedBook = await prisma.libro.findUnique({
          where: {
              ID_LIBRO: id,
          }
      })
      
      return requestedBook;
  } catch (error: any) {
      throw new Error(error);
  }
}

//Getting books by the words on the title
export async function getBookByNameService(title: String ) 
{
  try {
      var requestedBooks = null;
      requestedBooks = await prisma.libro.findMany({
          where: {
            TITULO: {
               //If the title of the book contains the word that the person is sending
              contains: title.toString(), 
              mode: "insensitive"
            },
          },
        })

        console.log(requestedBooks);
      return requestedBooks;
  } catch (error: any) {
      throw new Error(error);
  }
}

//updating a book
export async function updateBookService(
  id: number,
  isbn: string,
  titulo: string,
  autor: string, 
  editorial: string,
  fecha_edicion: string, 
  calificacion: any
) 

{
  
  try {

      const requestedBook = await prisma.libro.update({
          where: {ID_LIBRO: id},
          data: {
              ISBN: isbn, 
              TITULO: titulo, 
              AUTOR: autor, 
              EDITORIAL: editorial, 
              FECHA_EDICION: fecha_edicion, 
              CALIFICACION: calificacion
          }
      })
      
      return requestedBook;
  } catch (error: any) {
      throw new Error(error);
  }
}

//deleting a book
export async function deleteBookService(
  id: number,

) 
{
  try {
      const requestedBook = await prisma.libro.delete({
          where: {ID_LIBRO: id,},
          
      })
      
      return requestedBook;
  } catch (error: any) {
      throw new Error(error);
  }
}
