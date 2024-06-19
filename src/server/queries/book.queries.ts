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
      } catch (error: any) {
      throw new Error(`Failed to get books: ${error}`);
    }
  }

  // EXAMPLE OF AUTHMIDDLEWARE USAGE
  const user_id = await getUserFromAuth();

*/

// BOOKS EXISTS
export async function bookExists(
  isbn: string
): Promise<{ success: boolean; response?: any }> {
  try {
    const book = await prisma.libro.findFirst({
      where: {
        ISBN: String(isbn),
      },
    });
    if (book) {
      return { success: true, response: book };
    } else {
      return { success: false };
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      return { success: false };
    }
  }
}

//creating a book
export async function createBook(
  isbn: string,
  titulo: string,
  autor: string,
  editorial: string,
  fecha_edicion: string,
  imageurl: string,
  calificacion: number,
  tipo_tapa: string,
  precio: number,
  cantidad_libros: number
) {
  try {
    //Using prisma to create a book
    const createdBook = await prisma.libro.create({
      data: {
        ISBN: String(isbn),
        TITULO: titulo,
        AUTOR: autor,
        EDITORIAL: editorial,
        FECHA_EDICION: fecha_edicion,
        IMAGEURL: imageurl,
        CALIFICACION: calificacion,
        TIPO_TAPA: tipo_tapa,
        PRECIO: precio,
        CANTIDAD_LIBROS: cantidad_libros,
      },
    });

    return { success: true, response: createdBook };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("An unknown error occurred.");
    }
  }
}

//Getting all of the database books
export async function getAllBooks() {
  try {
    //Using prisma "findMany" to get all books
    const requestedBooks = await prisma.libro.findMany();
    return requestedBooks;
  } catch (error) {
    console.error("Error fetching books:", error);
    throw new Error("Unable to fetch books. Please try again later.");
  }
}

//Getting one specific book by id
export async function getBookService(id: number) {
  try {
    //with findUnique you can search for "Unique" denominated fields on prisma schema
    const requestedBook = await prisma.libro.findUnique({
      where: {
        ID_LIBRO: id,
      },
    });

    return requestedBook;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("An unknown error occurred.");
    }
  }
}

//Getting books by the words on the title
export async function getBookByNameService(title: String) {
  try {
    var requestedBooks = null;
    requestedBooks = await prisma.libro.findMany({
      where: {
        TITULO: {
          //If the title of the book contains the word that the person is sending
          contains: title.toString(),
          mode: "insensitive",
        },
      },
    });

    console.log(requestedBooks);
    return requestedBooks;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("An unknown error occurred.");
    }
  }
}

// add copies
export async function addCopies(isbn: string, cantidad_libros: number) {
  try {
    const book = await prisma.libro.findFirst({
      where: { ISBN: String(isbn) },
    });

    if (!book) {
      throw new Error("Book not found.");
    }

    const newCantidadLibros = book.CANTIDAD_LIBROS + cantidad_libros;

    const updatedBook = await prisma.libro.update({
      where: { ID_LIBRO: book.ID_LIBRO },
      data: {
        CANTIDAD_LIBROS: newCantidadLibros,
      },
    });

    return updatedBook;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("An unknown error occurred.");
    }
  }
}

//updating a book
export async function updateBook(
  isbn: string,
  titulo?: string,
  autor?: string,
  editorial?: string,
  fecha_edicion?: string,
  calificacion?: any,
  tipo_tapa?: any,
  precio?: any,
  cantidad_libros?: any
) {
  try {
    const book = await prisma.libro.findFirst({
      where: { ISBN: String(isbn) },
    });

    const requestedBook = await prisma.libro.update({
      where: { ID_LIBRO: book?.ID_LIBRO },
      data: {
        ISBN: String(isbn),
        TITULO: titulo,
        AUTOR: autor,
        EDITORIAL: editorial,
        FECHA_EDICION: fecha_edicion,
        CALIFICACION: calificacion,
        TIPO_TAPA: tipo_tapa,
        PRECIO: precio,
        CANTIDAD_LIBROS: cantidad_libros,
      },
    });

    return requestedBook;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("An unknown error occurred.");
    }
  }
}

//deleting a book
export async function deleteBookService(id: number) {
  try {
    const requestedBook = await prisma.libro.delete({
      where: { ID_LIBRO: id },
    });

    return requestedBook;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("An unknown error occurred.");
    }
  }
}
