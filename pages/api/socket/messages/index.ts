import { NextApiRequest } from "next";
import { NextApiResponseServerIo } from "@/types";
import prisma from "@/libs/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "NOT THIS METHOD" });
  }

  try {
    const { content } = req.body;
    const { messageId, senderId } = req.query;

    if (!messageId) {
      return res.status(400).json({ error: "messageId is missing" });
    }

    if (!senderId) {
      return res.status(400).json({ error: "senderId is missing" });
    }

    if (!content) {
      return res.status(400).json({ error: "content is missing" });
    }

    const message = await prisma.message.findUnique({
      where: { id: messageId as string },
    });

    if (!message) {
      return res.status(404).json({ error: "couldnot find message" });
    }

    const sender = await prisma.user.findUnique({
      where: { id: senderId as string },
    });

    if (!sender) {
      return res.status(404).json({ error: "couldnot find sender" });
    }

    const postedMessage = await prisma.directMessage.create({
      data: {
        chat: content,
        messageId: messageId as string,
        senderId: sender.id as string,
      },
      include: {
        sender: true,
      },
    });

    if (!postedMessage) {
      console.log("Coulnot create the message");
    }

    const messageKey = `chat:${messageId}:messages`;

    res?.socket?.server?.io?.emit(messageKey, postedMessage);

    return res.status(200).json(postedMessage);
  } catch (err) {
    console.log("[MESSAGE_POST]", err);
    return res.status(500).json({ message: "Internal Error" });
  }
}
