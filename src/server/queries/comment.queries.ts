"use server";
import prisma from "../prismaClient";

//Creating comments
export async function createCommentService(
    descripcion_comentario: string,
    id_usuario: number, 
    id_libro: number
) {
    try {
        //Using prisma to create a comment
        const createdComment = await prisma.comentario.create({
            data: {
                DESCRIPCION_COMENTARIO: descripcion_comentario,
                usuario: {
                    connect:{ID_USUARIO: id_usuario}
                },
                libro: {
                    connect: { ID_LIBRO: id_libro }
                }
            }
        });

        return createdComment;
    } catch (error: any) {
        throw new Error(error);
    }
}

//Getting all of the database comments
export async function getAllCommentService(){
    try {
        //Using prisma "findMany" to get all comments
        const requestedComment = await prisma.comentario.findMany();
        return requestedComment;
        
    } catch (error: any) {
        console.error("Error fetching Comments:", error);
        throw new Error("Unable to fetch Comments. Please try again later.");
    }
}


//Getting one specific comment by id
export async function getCommentService(id: number) 
{
    try {
        //with findUnique you can search for "Unique" denominated fields on prisma schema
        const requestedComments = await prisma.comentario.findUnique({
            where: {
                ID_COMENTARIO: id,
            }
        })
        
        return requestedComments;
    } catch (error: any) {
        throw new Error(error);
    }
}

//Updating comment
export async function updateCommentService(
    id: number,
    descripcion_comentario : string,
    id_usuario : number,
    id_libro : number
) 
{
    try {
        const requestedComment = await prisma.comentario.update({
            where: {ID_COMENTARIO: id},
            data: {
                DESCRIPCION_COMENTARIO: descripcion_comentario,
                ID_USUARIO: id_usuario,
                ID_LIBRO: id_libro
            }
        })
        
        return requestedComment;
    } catch (error: any) {
        throw new Error(error);
    }
}


//Deleting a comment
export async function deleteCommentService(
    id: number,

) 
{
    try {
        const requestedComment = await prisma.comentario.delete({
            where: {ID_COMENTARIO: id,},
            
        })
        
        return requestedComment;
    } catch (error: any) {
        throw new Error(error);
    }
}