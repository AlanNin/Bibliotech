"use server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import prisma from "../prismaClient";

// CREATE SELL
export async function createSell(
  envio: string,
  direccion: string | undefined,
  pais: string | undefined,
  ciudad: string | undefined,
  codigo_postal: string | undefined,
  cantidad_libros: number,
  impuestos: number,
  subtotal: number,
  total: number,
  id_stripe: string,
  id_libro: number
) {
  try {
    const { userId } = auth();

    if (!userId) {
      throw new Error("User ID is undefined");
    }

    // Obtener la cantidad actual de libros
    const libro = await prisma.libro.findUnique({
      where: { ID_LIBRO: id_libro },
      select: { CANTIDAD_LIBROS: true },
    });

    if (!libro) {
      throw new Error("Libro no encontrado");
    }

    if (libro.CANTIDAD_LIBROS < cantidad_libros) {
      throw new Error("No hay suficientes libros en stock");
    }

    const createdSell = await prisma.ventas.create({
      data: {
        ENVIO: envio,
        DIRECCION: direccion,
        PAIS: pais,
        CIUDAD: ciudad,
        CODIGO_POSTAL: codigo_postal,
        CANTIDAD_LIBROS: cantidad_libros,
        IMPUESTOS: impuestos,
        SUBTOTAL: subtotal,
        TOTAL: total,
        ID_STRIPE: id_stripe,
        libro: {
          connect: { ID_LIBRO: id_libro },
        },
        ID_USUARIO: userId?.toString(),
      },
    });

    await prisma.libro.update({
      where: { ID_LIBRO: id_libro },
      data: { CANTIDAD_LIBROS: libro.CANTIDAD_LIBROS - cantidad_libros },
    });

    return createdSell;
  } catch (error) {
    console.log(error);
    throw new Error("Unable create sell. Please try again later.");
  }
}

// GET SELL BY STRIPE ID
export async function getSellByStripeId(stripeId: string) {
  const { userId } = auth();

  try {
    const data = await prisma.ventas.findFirst({
      where: {
        ID_STRIPE: stripeId,
      },
    });

    if (!data) {
      throw new Error("Sell not found");
    }

    if (!userId) {
      throw new Error("User ID is undefined");
    }

    const user = await clerkClient.users.getUser(userId);
    const userFullName = user.fullName || "";
    const userEmail = user.emailAddresses[0]?.emailAddress || "";
    const userPhone = user.phoneNumbers[0]?.phoneNumber || "";

    const response = {
      ...data,
      userFullName,
      userEmail,
      userPhone,
    };

    return response;
  } catch (error) {
    console.error("Error fetching sell data:", error);
    throw new Error("Unable to get sell data. Please try again later.");
  }
}

//Getting all of the database sells
export async function getAllSellsService() {
  try {
    //Using prisma "findMany" to get all sells
    const requestedSells = await prisma.ventas.findMany();
    return requestedSells;
  } catch (error) {
    console.error("Error fetching Sells:", error);
    throw new Error("Unable to fetch Sells. Please try again later.");
  }
}

//Getting one specific sell by id
export async function getSellService(id: number) {
  try {
    //with findUnique you can search for "Unique" denominated fields on prisma schema
    const requestedSell = await prisma.ventas.findUnique({
      where: {
        ID_VENTAS: id,
      },
    });

    return requestedSell;
  } catch (error) {
    throw new Error("Unable get sell. Please try again later.");
  }
}

//Updating sell
export async function updateSellService(
  id: number,
  cantidad_libros: number,
  impuestos: any,
  subtotal: any,
  total: any,
  id_libro: number
) {
  try {
    const requestedSell = await prisma.ventas.update({
      where: { ID_VENTAS: id },
      data: {
        CANTIDAD_LIBROS: cantidad_libros,
        IMPUESTOS: impuestos,
        SUBTOTAL: subtotal,
        TOTAL: total,
        libro: {
          connect: { ID_LIBRO: id_libro },
        },
      },
    });

    return requestedSell;
  } catch (error) {
    throw new Error("Unable update sell. Please try again later.");
  }
}

//Deleting a sell
export async function deleteSell(id: number) {
  try {
    const requestedSell = await prisma.ventas.delete({
      where: { ID_VENTAS: id },
    });

    return requestedSell;
  } catch (error) {
    throw new Error("Unable delete sell. Please try again later.");
  }
}

export async function getUserOrders(userId: string) {
  try {
    const response = await prisma.ventas.findMany({
      where: {
        ID_USUARIO: userId,
      },
    });
    return response;
  } catch (error) {
    console.error("Error fetching Sells:", error);
    throw new Error("Unable to fetch Sells. Please try again later.");
  }
}
