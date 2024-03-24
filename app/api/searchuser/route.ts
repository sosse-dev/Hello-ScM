import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";

const AMOUNT_OF_USERS_TAKEN = 30;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const searchInput = searchParams.get("searchInput");
    const cursor = searchParams.get("cursor");

    let data: any = [];

    if (cursor) {
      data = 
      await prisma.user.findMany({
        where: {
          name: {
            contains: searchInput ?? "",
          },
        },
        skip: 1,
        cursor: {
          id: cursor as string,
        },
        take: AMOUNT_OF_USERS_TAKEN,
        select: {
          id: true,
          name: true,
          username: true,
          image: true,
        },
      });
    } else {
      data = await prisma.user.findMany({
        where: {
          name: {
            contains: searchInput ?? "",
          },
        },
        take: AMOUNT_OF_USERS_TAKEN,
        select: {
          id: true,
          name: true,
          username: true,
          image: true,
        },
      });
    }

    let nextCursor = null;

    if (data.length === AMOUNT_OF_USERS_TAKEN) {
      nextCursor = data[AMOUNT_OF_USERS_TAKEN - 1].id;
    }

    return NextResponse.json({ data, nextCursor, response: "FOUND" });
  } catch (err) {
    return NextResponse.json({ error: "Internal Error", status: 500 });
  }
}
