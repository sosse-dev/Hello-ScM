import prisma from "@/libs/prisma";
import getSession from "./getSession";

export default async function getChatUser() {
  const session = await getSession();
  try {
    if (!session?.user.id) {
      return null;
    }

    const data = await prisma.message.findMany({
      where: {
        receiverId: session.user.id,
      },
      include: {
        sender: true,
      },
    });

    const data2 = await prisma.message.findMany({
      where: {
        senderId: session.user.id,
      },
      include: {
        receiver: true,
      },
    });

    return { data, data2 };
  } catch (err) {
    return null;
  }
}
