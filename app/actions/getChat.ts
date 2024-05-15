import { prisma } from "@/lib/prisma"
import getSession from "./getSession";

export default async function getChat(userId: string) {
  const session = await getSession();
  try {
    const data = await prisma.message.findMany({
      where: { receiverId: session?.user.id, senderId: userId },
      include: {
        sender: true,
      },
    });

    if (data) {
      return data;
    }

    const data2 = await prisma.message.findMany({
      where: { receiverId: userId, senderId: session?.user.id },
      include: {
        receiver: true,
      },
    });

    if (data2) {
      return data2;
    }

    return null;
  } catch (err) {
    return null;
  }
}
