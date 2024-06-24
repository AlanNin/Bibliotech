"use server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import prisma from "../prismaClient";

// CREATE COMMENT
export async function createComment(
  descripcion_comentario: string,
  id_libro: number
) {
  try {
    const { userId } = auth();
    if (!userId) {
      throw new Error("User ID is undefined");
    }
    const createdComment = await prisma.comentario.create({
      data: {
        DESCRIPCION_COMENTARIO: descripcion_comentario,
        ID_USUARIO: userId?.toString(),
        libro: {
          connect: { ID_LIBRO: id_libro },
        },
      },
    });

    return createdComment;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("An unknown error occurred.");
    }
  }
}

// GET COMMENTS FROM A BOOKID
export async function getCommentFromBookId(bookId: number) {
  try {
    const data = await prisma.comentario.findMany({
      where: {
        ID_LIBRO: bookId,
      },
      orderBy: {
        ID_COMENTARIO: "desc",
      },
    });

    const response = await Promise.all(
      data.map(async (comment) => {
        const user = await clerkClient.users.getUser(comment.ID_USUARIO);
        const userFullName = user.fullName || "";
        const userImage = user.imageUrl || "";

        return {
          ...comment,
          userFullName,
          userImage,
        };
      })
    );

    return response;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("An unknown error occurred.");
    }
  }
}

//Getting all of the database comments
export async function getAllCommentService() {
  try {
    //Using prisma "findMany" to get all comments
    const requestedComment = await prisma.comentario.findMany();
    return requestedComment;
  } catch (error) {
    console.error("Error fetching Comments:", error);
    throw new Error("Unable to fetch Comments. Please try again later.");
  }
}

//Getting one specific comment by id
export async function getCommentService(id: number) {
  try {
    //with findUnique you can search for "Unique" denominated fields on prisma schema
    const requestedComments = await prisma.comentario.findUnique({
      where: {
        ID_COMENTARIO: id,
      },
    });

    return requestedComments;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("An unknown error occurred.");
    }
  }
}

//Updating comment
export async function updateComment(
  id: number,
  descripcion_comentario: string
) {
  try {
    const requestedComment = await prisma.comentario.update({
      where: { ID_COMENTARIO: id },
      data: {
        DESCRIPCION_COMENTARIO: descripcion_comentario,
      },
    });

    return requestedComment;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("An unknown error occurred.");
    }
  }
}

//Deleting a comment
export async function deleteComment(id: number) {
  try {
    const requestedComment = await prisma.comentario.delete({
      where: { ID_COMENTARIO: id },
    });

    return requestedComment;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("An unknown error occurred.");
    }
  }
}
