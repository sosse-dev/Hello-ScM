import { prisma } from "@/lib/prisma"

export const getVerificationTokenByToken = async(token: string) => {
    try {
        const verificationToken = await prisma.verficationToken.findUnique({
            where: {
                token
            }
        })

        return verificationToken
    } catch {
        return null
    }
}

export const getVerificationTokenByEmail = async(email: string) => {
    try {
        const verificationToken = await prisma.verficationToken.findFirst({
            where: {
                email
            }
        })

        return verificationToken
    } catch {
        return null
    }
}