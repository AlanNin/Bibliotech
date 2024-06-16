"use server";
import prisma from "../prismaClient";

//Creating exemplary
export async function createExemplaryService(
    fecha_adquisicion: Date,
    ubicacion_libreria: string, 
    precio: any, 
    estado: string, 
    tipo_tapa: string, 
    id_libro: number
) {
    try {
        //Using prisma to create a exemplary
        const createdExemplary = await prisma.ejemplar.create({
            data: {
                FECHA_ADQUISICION: fecha_adquisicion,
                UBICACION_LIBRERIA: ubicacion_libreria,
                PRECIO: precio,
                ESTADO: estado,
                TIPO_TAPA: tipo_tapa,
                libro: {
                    connect: { ID_LIBRO: id_libro }
                }
            }
        });

        return createdExemplary;
    } catch (error: any) {
        throw new Error(error);
    }
}


//Getting all of the database exemplary
export async function getAllExemplaryService(){
    try {
        //Using prisma "findMany" to get all exemplarys
        const requestedExemplary = await prisma.ejemplar.findMany();
        return requestedExemplary;
        
    } catch (error: any) {
        console.error("Error fetching Exemplarys:", error);
        throw new Error("Unable to fetch Exemplarys. Please try again later.");
    }
}

//Getting one specific comment by id
export async function getExemplaryService(id: number) 
{
    try {
        //with findUnique you can search for "Unique" denominated fields on prisma schema
        const requestedExemplary = await prisma.ejemplar.findUnique({
            where: {
                NUM_EJEMPLAR: id,
            }
        })
        
        return requestedExemplary;
    } catch (error: any) {
        throw new Error(error);
    }
}

//Updating exemplary
export async function updateExemplaryService(
    id: number,
    fecha_adquisicion : Date,
    ubicacion_libreria : string, 
    precio : any, 
    estado : string, 
    tipo_tapa : string, 
    id_libro : number
) 
{
    try {
        const requestedExemplary = await prisma.ejemplar.update({
            where: {NUM_EJEMPLAR: id},
            data: {
                FECHA_ADQUISICION: fecha_adquisicion,
                UBICACION_LIBRERIA: ubicacion_libreria,
                PRECIO: precio,
                ESTADO: estado,
                TIPO_TAPA: tipo_tapa,
                ID_LIBRO: id_libro
            }
        })
        
        return requestedExemplary;
    } catch (error: any) {
        throw new Error(error);
    }
}

//Deleting exemplary
export async function deleteExemplaryService(
    id: number,

) 
{
    try {
        const requestedExemplary = await prisma.ejemplar.delete({
            where: {NUM_EJEMPLAR: id,},
            
        })
        
        return requestedExemplary;
    } catch (error: any) {
        throw new Error(error);
    }
}