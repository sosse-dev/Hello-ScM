import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const username = params.slug[0]

    if(!username || username === "undefined") {
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
