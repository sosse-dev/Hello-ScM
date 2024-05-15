import { prisma } from "@/lib/prisma"

export default async function getUserById(id: string) {
  try {
    const data = await prisma.user.findFirst({
      where: {
        id,
      },
      select: {
        emailVerified: true
      }
    });

    return data
  } catch (err) {
    return null;
  }
}
