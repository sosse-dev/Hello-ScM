import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username");

    if(!username) {
        return NextResponse.json({ response: "Invalid username", status: 400 })
    }

    const thisFollower = await prisma.follow.findMany({
      where: {
        follower: {
          username,
        },
      },
      include: {
        following: true,
      },
    });

    const thisUserFollowing = await prisma.follow.findMany({
      where: {
        following: {
          username,
        },
      },
      include: {
        follower: true,
      },
    });
    return NextResponse.json({ data: thisFollower, data2: thisUserFollowing });
  } catch (err) {
    return NextResponse.json({ error: "internal Error", status: 500 });
  }
}
