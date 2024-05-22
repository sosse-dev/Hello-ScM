import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const AMOUNT_OF_POST_TAKEN = 10;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const cursor = searchParams.get("cursor");
  try {
    let data = [];

    if (cursor) {
      data = await prisma.post.findMany({
        skip: 1,
        cursor: {
          id: cursor as string,
        },
        take: AMOUNT_OF_POST_TAKEN,
        include: { user: true },
      });
    } else {
      data = await prisma.post.findMany({
        take: AMOUNT_OF_POST_TAKEN,
        include: { user: true },
      });
    }

    let nextCursor = null;

    if (data.length === AMOUNT_OF_POST_TAKEN) {
      nextCursor = data[AMOUNT_OF_POST_TAKEN - 1].id;
    }

    return NextResponse.json({ data, nextCursor, response: "FOUND" });
  } catch (err) {
    console.log("Dari All Posts explore", err);
    return NextResponse.json({ error: "Internal Error", status: 500 });
  }
}
