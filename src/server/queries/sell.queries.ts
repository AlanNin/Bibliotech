"use server";
import { auth } from "@clerk/nextjs/server";
import prisma from "../prismaClient";

//Creating sells
export async function createSellService(
    cantidad_libros : number,
    impuestos : any, 
    subtotal : any, 
    total : any, 
    id_libro : number, 
    

) {
    try {
        const { userId } = auth();
    if (!userId) {
      throw new Error("User ID is undefined");
    }
        //Using prisma to create a sell
        const createdSell = await prisma.ventas.create({
            data: {
                CANTIDAD_LIBROS: cantidad_libros,
                IMPUESTOS: impuestos,
                SUBTOTAL: subtotal,
                TOTAL: total,
                libro : {
                    connect:{ID_LIBRO : id_libro}
                },
                ID_USUARIO : userId?.toString()
            }
        });

        return createdSell;
    } catch (error: any) {
        throw new Error(error);
    }
}

//Getting all of the database sells
export async function getAllSellsService(){
    try {
        //Using prisma "findMany" to get all sells
        const requestedSells = await prisma.ventas.findMany();
        return requestedSells;
        
    } catch (error: any) {
        console.error("Error fetching Sells:", error);
        throw new Error("Unable to fetch Sells. Please try again later.");
    }
}

//Getting one specific sell by id
export async function getSellService(id: number) 
{
    try {
        //with findUnique you can search for "Unique" denominated fields on prisma schema
        const requestedSell = await prisma.ventas.findUnique({
            where: {
                ID_VENTAS: id,
            }
        })
        
        return requestedSell;
    } catch (error: any) {
        throw new Error(error);
    }
}

//Updating sell
export async function updateSellService(
    id: number,
    cantidad_libros : number,
    impuestos : any, 
    subtotal : any, 
    total : any, 
    id_libro : number, 
) 
{
    try {
        const requestedSell = await prisma.ventas.update({
            where: {ID_VENTAS: id},
            data: {
                CANTIDAD_LIBROS: cantidad_libros,
                IMPUESTOS: impuestos,
                SUBTOTAL: subtotal,
                TOTAL: total,
                ID_LIBRO: id_libro,
            }
        })
        
        return requestedSell;
    } catch (error: any) {
        throw new Error(error);
    }
}

//Deleting a sell
export async function deleteSellService(
    id: number,

) 
{
    try {
        const requestedSell = await prisma.ventas.delete({
            where: {ID_VENTAS: id,},
            
        })
        
        return requestedSell;
    } catch (error: any) {
        throw new Error(error);
    }
}