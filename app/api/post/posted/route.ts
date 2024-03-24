import prisma from "@/libs/prisma";
import { NextResponse } from "next/server";

const AMOUNT_OF_POST_TAKEN = 6;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const cursor = searchParams.get("cursor");
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ response: "Invalid User Id", status: 400 });
    }

    let data = [];

    if (cursor) {
      data = await prisma.post.findMany({
        where: { userId: userId as string },
        take: AMOUNT_OF_POST_TAKEN,
        skip: 1,
        cursor: {
          id: cursor as string,
        },
        include: { user: true },
      });
    } else {
      data = await prisma.post.findMany({
        where: { userId: userId },
        take: AMOUNT_OF_POST_TAKEN,
        include: { user: true },
      });
    }

    let nextCursor = null;

    if (data.length === AMOUNT_OF_POST_TAKEN) {
      nextCursor = data[AMOUNT_OF_POST_TAKEN - 1].id;
    }

    return NextResponse.json({ data: data, nextCursor, response: "Sended" });
  } catch (err) {
    return NextResponse.json({ error: "Internal Error", status: 500 });
  }
}
