import prisma from "@/libs/prisma";

export default async function getUserId(username: string) {
  try {
    const data = await prisma.user.findFirst({
      where: {
        username: username,
      },
      select: {
        id: true,
      },
    });

    return data?.id;
  } catch (err) {
    return null;
  }
}
