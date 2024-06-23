"use server";
import prisma from "../prismaClient";

// CREATE GENRE
export async function createGenreService(nombre_genero: string) {
  try {
    //Using prisma to create a genre
    const createdGenre = await prisma.genero.create({
      data: {
        NOMBRE_GENERO: nombre_genero,
      },
    });

    return createdGenre;
  } catch (error) {
    throw new Error(error);
  }
}

//Getting all of the database genres
export async function getAllGenreService() {
  try {
    //Using prisma "findMany" to get all genres
    const requestedGenre = await prisma.genero.findMany();
    return requestedGenre;
  } catch (error) {
    console.error("Error fetching Genres:", error);
    throw new Error("Unable to fetch Genres. Please try again later.");
  }
}

//Getting one specific genre by id
export async function getGenreService(id: number) {
  try {
    //with findUnique you can search for "Unique" denominated fields on prisma schema
    const requestedGenre = await prisma.genero.findUnique({
      where: {
        ID_GENERO: id,
      },
    });

    return requestedGenre;
  } catch (error) {
    throw new Error(error);
  }
}

//Updating genre
export async function updateGenreService(id: number, nombre_genero: string) {
  try {
    const requestedGenre = await prisma.genero.update({
      where: { ID_GENERO: id },
      data: {
        NOMBRE_GENERO: nombre_genero,
      },
    });

    return requestedGenre;
  } catch (error) {
    throw new Error(error);
  }
}

//Deleting a genre
export async function deleteGenreService(id: number) {
  try {
    const requestedGenre = await prisma.genero.delete({
      where: { ID_GENERO: id },
    });

    return requestedGenre;
  } catch (error) {
    throw new Error(error);
  }
}
