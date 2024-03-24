import { NextResponse } from "next/server";
import { DirectMessage } from "@prisma/client";
import prisma from "@/libs/prisma";

const AMOUNT_OF_MESSAGES_TAKEN = 10;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const cursor = searchParams.get("cursor");
    const messageId = searchParams.get("messageId");

    let data: DirectMessage[] = [];

    if (cursor) {
      data = await prisma.directMessage.findMany({
        take: AMOUNT_OF_MESSAGES_TAKEN,
        skip: 1,
        cursor: {
          id: cursor,
        },
        where: {
          messageId: messageId as string,
        },
        include: {
          sender: true,
        },
        orderBy: {
          createdAt: "desc"
        }
      });
    } else {
      data = await prisma.directMessage.findMany({
        take: AMOUNT_OF_MESSAGES_TAKEN,
        where: {
          messageId: messageId as string,
        },
        include: {
          sender: true,
        },
        orderBy: {
          createdAt: "desc"
        }
      });
    }

    let nextCursor = null;

    if (data.length === AMOUNT_OF_MESSAGES_TAKEN) {
      nextCursor = data[AMOUNT_OF_MESSAGES_TAKEN - 1].id;
    }
    return NextResponse.json({ chats: data, nextCursor });
  } catch (err) {
    return NextResponse.json({error: "Internal Error", status: 500 });
  }
}
