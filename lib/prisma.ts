import { PrismaClient } from "@prisma/client"

// declare secara global type nya
declare global {
    var prisma : PrismaClient | undefined
}
// global pertama prisma itu undefined


export const prisma: PrismaClient = global.prisma || new PrismaClient()

// gunanya agar prisma instance dipakai ulang bukan dibikin baru selama hot-reloading.
if(process.env.NODE_ENV === "development") global.prisma = prisma 