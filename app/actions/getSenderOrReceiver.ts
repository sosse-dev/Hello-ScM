import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";

export default async function getSenderOrReceiver(
  messageId: string,
  sessionId: string
) {
  try {
    let data;

    if (!messageId) {
      return NextResponse.json({ error: "Invalid Message Id", status: 400 });
    }

    if (!sessionId) {
      return NextResponse.json({ error: "Invalid Session Id", status: 400 });
    }

    data = await prisma.message.findFirst({
      where: { id: messageId, senderId: sessionId },
      include: { receiver: true },
    });

    if (!data) {
      data = await prisma.message.findFirst({
        where: { id: messageId, receiverId: sessionId },
        include: { sender: true },
      });
    }

    if (!data) {
      return null;
    }

    return data;
  } catch (err) {
    return null;
  }
}
