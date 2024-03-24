import prisma from "@/libs/prisma";
import getSession from "./getSession";

export default async function getMessage() {
  const session = await getSession();
  try {
    const message = await prisma.message.findMany({
      where: { senderId: session?.user.id },
      include: { receiver: true },
    });

    const message2 = await prisma.message.findMany({
      where: { receiverId: session?.user.id },
      include: { sender: true },
    });

    if (!message) {
      return { message2 };
    }

    if (!message2) {
      return { message };
    }

    if (!message && !message2) {
      return null;
    }

    const mergeMessages = [...message, ...message2];

    return mergeMessages;
  } catch (err) {
    return null;
  }
}
