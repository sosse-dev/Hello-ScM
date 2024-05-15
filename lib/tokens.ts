import { getVerificationTokenByEmail } from "@/app/actions/data/getVerificationToken"
import { v4 as uuidv4 } from "uuid"
import { prisma } from "@/lib/prisma"
import { getPasswordResetTokenByEmail } from "@/app/actions/data/getPasswordResetToken" 

export const generateVerificationToken = async(email: string) => {
    const token = uuidv4()
    const expires = new Date(new Date().getTime() + 3600 * 1000)

    const cekToken = await getVerificationTokenByEmail(email)

    if(cekToken) {
        await prisma.verficationToken.delete({
            where: {
                id: cekToken.id
            }
        })
    }

    const verficationToken = await prisma.verficationToken.create({
        data: {
            email,
            token,
            expires
        }
    })

    return verficationToken
}

export const generatePasswordResetToken = async(email: string) => {
    const token = uuidv4()
    const expires = new Date(new Date().getTime() + 3600 * 1000)

    const cekToken = await getPasswordResetTokenByEmail(email)

    if(cekToken) {
        await prisma.passwordResetToken.delete({
            where: {id: cekToken.id}
        })
    }

    const passwordResetToken = await prisma.passwordResetToken.create({
        data: {
            email,
            token,
            expires
        }
    })

    return passwordResetToken
}