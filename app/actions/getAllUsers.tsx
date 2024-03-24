import prisma from "@/libs/prisma"

export default async function getAllUsers() {
    try {
        const users = await prisma.user.findMany();

        if(!users) {
            return null
        }
        
        return users
    } catch (err) {
        return null
    }
}