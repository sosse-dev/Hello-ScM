import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import getSession from "@/app/actions/getSession";

const AMOUNT_OF_POST_TAKEN: number = 5;

export async function GET(req: Request) {
  try {
    const session = await getSession();
    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get("cursor");

    if (!session) {
      return NextResponse.json({ response: "Unauthorized", status: 401 });
    }

    let data = [];

    if (cursor) {
      data = await prisma.post.findMany({
        where: {
          user: {
            follower: {
              some: {
                followingId: session.user.id,
              },
            },
          },
        },
        take: AMOUNT_OF_POST_TAKEN,
        skip: 1,
        cursor: {
          id: cursor,
        },
        include: {
          user: true,
          comments: true
        },
      });
    } else {
      data = await prisma.post.findMany({
        where: {
          user: {
            follower: {
              some: {
                followingId: session.user.id,
              },
            },
          },
        },
        take: AMOUNT_OF_POST_TAKEN,
        include: {
          user: true,
          comments: true
        },
      });
    }

    if (!data) {
      return NextResponse.json({
        response: "Coulnot find any post",
        status: 404,
      });
    }

    let nextCursor = null;

    if (data.length === AMOUNT_OF_POST_TAKEN) {
      nextCursor = data[AMOUNT_OF_POST_TAKEN - 1].id;
    }

    return NextResponse.json({ data: data, nextCursor, response: "FOUND" });
  } catch (err) {
    return NextResponse.json({ error: "Internal Error", status: 500 });
  }
}
