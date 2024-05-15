import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const messageId = searchParams.get("messageId");
    const sessionId = searchParams.get("sessionId");

    let data;

    if (!messageId) {
      return NextResponse.json({ response: "Invalid Message Id", status: 400 });
    }

    if (!sessionId) {
      return NextResponse.json({ response: "Invalid Session Id", status: 400 });
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
      return NextResponse.json({
        response: "Coulnot find the message",
        status: 404,
      });
    }

    return NextResponse.json({ data });
  } catch (err) {
    return NextResponse.json({ error: "Internal Error", status: 500 });
  }
}
