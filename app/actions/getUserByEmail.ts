import { prisma } from "@/lib/prisma";

export async function getUserByEmail(email: string) {
  try {
    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    return user;
  } catch (err) {
    return null;
  }
}
