"use server";
import prisma from "../prismaClient";

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

// CREATE BOOK
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
  cantidad_libros: number,
  genres: string[]
) {
  try {
    const genreIds: number[] = [];

    for (const genre of genres) {
      let existingGenre;
      try {
        existingGenre = await prisma.genero.findFirst({
          where: { NOMBRE_GENERO: genre },
        });
      } catch (error) {
        return {
          success: false,
          response: "This genre is not allowed or was not found",
        };
      }

      if (!existingGenre) {
        const createdGenre = await prisma.genero.create({
          data: { NOMBRE_GENERO: genre },
        });
        genreIds.push(createdGenre.ID_GENERO);
      } else {
        genreIds.push(existingGenre.ID_GENERO);
      }
    }

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
        Libro_Genero: {
          create: genreIds.map((ID_GENERO: number) => ({
            genero: { connect: { ID_GENERO } },
          })),
        },
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

// GET ALL BOOKS
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

// GET BOOK BY ISBN
export async function getBookByISBN(isbn: string) {
  try {
    const requestedBook = await prisma.libro.findFirst({
      where: {
        ISBN: isbn,
      },
      include: {
        Libro_Genero: {
          include: {
            genero: true,
          },
        },
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

// SEARCH BOOKS BY TITLE
export async function getBookByNameService(tolook: String) {
  try {
    var requestedBooks = null;
    requestedBooks = await prisma.libro.findMany({
      where: {
        TITULO: {
          contains: tolook.toString(),
          mode: "insensitive",
        },
      },
    });

    requestedBooks.push(...(await getBooksByGenreService(tolook)));

    return requestedBooks;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("An unknown error occurred.");
    }
  }
}

// SEARCH BOOKS BY GENRE
export async function getBooksByGenreService(generos: String) {
  try {
    const genre = await prisma.genero.findMany({
      where: {
        NOMBRE_GENERO: {
          equals: generos.toString(),
          mode: "insensitive",
        },
      },
      select: {
        ID_GENERO: true,
      },
    });

    const genreIds = genre.map((g) => g.ID_GENERO);

    const books = await prisma.libro_Genero.findMany({
      where: {
        ID_GENERO: {
          in: genreIds,
        },
      },
      select: {
        ID_LIBRO: true,
      },
    });

    const librosIds = books.map((g) => g.ID_LIBRO);

    const requestedBooks = await prisma.libro.findMany({
      where: {
        ID_LIBRO: {
          in: librosIds,
        },
      },
    });
    return requestedBooks;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("An unknown error occurred.");
    }
  }
}
// ADD COPIES
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

// UPDATE BOOK
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

// DELETE BOOK
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
