"use server";
import prisma from "../prismaClient";

//Getting all of the database users
export async function getAllUsersService(){
    try {
        //Using prisma "findMany" to get all users
        const requestedUsers = await prisma.usuario.findMany();
        return requestedUsers;
        
    } catch (error: any) {
        console.error("Error fetching Users:", error);
        throw new Error("Unable to fetch Users. Please try again later.");
    }
}

//Getting one specific user by id
export async function getUserService(id: number) 
{
    try {
        //with findUnique you can search for "Unique" denominated fields on prisma schema
        const requestedUser = await prisma.usuario.findUnique({
            where: {
                ID_USUARIO: id,
            }
        })
        
        return requestedUser;
    } catch (error: any) {
        throw new Error(error);
    }
}

//Updating user
export async function updateUserService(
    id: number,
    nombre: string,
    contrasena: string,
    correo_electronico: string, 
) 
{
    try {
        const requestedUser = await prisma.usuario.update({
            where: {ID_USUARIO: id},
            data: {
                NOMBRE: nombre,
                CONTRASENA: contrasena,
                CORREO_ELECTRONICO: correo_electronico,
                
            }
        
        })
        
        return requestedUser;
    } catch (error: any) {
        throw new Error(error);
    }
}

//Deleting a user
export async function deleteUserService(
    id: number,

) 
{
    try {
        const requestedUser = await prisma.usuario.delete({
            where: {ID_USUARIO: id,},
            
        })
        
        return requestedUser;
    } catch (error: any) {
        throw new Error(error);
    }
}