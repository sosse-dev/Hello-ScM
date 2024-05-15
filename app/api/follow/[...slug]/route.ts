import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import getUserId from "@/app/actions/getUserId";

export async function POST(
  req: Request,
  { params }: { params: { slug: string[] } }
) {
  try {
    if (!params.slug[0]) {
      return NextResponse.json({
        response: "Invalid Id",
        status: 400,
      });
    }

    if (!params.slug[1]) {
      return NextResponse.json({ response: "Invalid Id", status: 400 });
    }

    const existingFollow = await prisma.follow.findFirst({
      where: {
        followerId: params.slug[1],
        followingId: params.slug[0],
      },
    });

    if (!existingFollow) {
      const newFollow = await prisma.follow.create({
        data: {
          followerId: params.slug[1],
          followingId: params.slug[0],
        },
      });

      return NextResponse.json({ response: "JUST FOLLOWED" });
    }

    return NextResponse.json({ response: "FOLLOWED" });
  } catch (err) {
    return NextResponse.json({ response: err, status: 500 });
  }
}

const AMOUNT_OF_DATA_TAKEN = 10;

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const userId = await getUserId(params.slug[0] as string);

    const { searchParams } = new URL(req.url);
    const cursor1 = searchParams.get("cursor1");
    const cursor2 = searchParams.get("cursor2");

    if (!userId) {
      return NextResponse.json({ response: "Invalid Id", status: 400 });
    }

    let thisFollower = [];

    if (cursor1) {
      thisFollower = await prisma.follow.findMany({
        where: {
          followerId: userId as string,
        },
        include: {
          following: true,
        },
        take: AMOUNT_OF_DATA_TAKEN,
        skip: 1,
        cursor: {
          id: cursor1,
        },
      });
    } else {
      thisFollower = await prisma.follow.findMany({
        where: {
          followerId: userId as string,
        },
        include: {
          following: true,
        },
        take: AMOUNT_OF_DATA_TAKEN,
      });
    }

    let thisUserFollowing = [];

    if (cursor2) {
      thisUserFollowing = await prisma.follow.findMany({
        where: {
          followingId: userId as string,
        },
        include: {
          follower: true,
        },
        take: AMOUNT_OF_DATA_TAKEN,
        skip: 1,
        cursor: {
          id: cursor2,
        },
      });
    } else {
      thisUserFollowing = await prisma.follow.findMany({
        where: {
          followingId: userId as string,
        },
        include: {
          follower: true,
        },
        take: AMOUNT_OF_DATA_TAKEN,
      });
    }

    if (!thisFollower) {
      return NextResponse.json({ response: "No Follower", status: 404 });
    }

    if (!thisUserFollowing) {
      return NextResponse.json({ response: "No Following", status: 404 });
    }

    const followerId = await prisma.user.findFirst({
      where: {
        email: params.slug[0] as string,
      },
      select: {
        id: true,
      },
    });

    const existingFollow = await prisma.follow.findFirst({
      where: {
        followerId: userId as string,
        followingId: followerId?.id as string,
      },
    });

    let nextCursor1 = null;

    if (thisFollower.length === AMOUNT_OF_DATA_TAKEN) {
      nextCursor1 = thisFollower[AMOUNT_OF_DATA_TAKEN - 1].id;
    }

    let nextCursor2 = null;

    if (thisUserFollowing.length === AMOUNT_OF_DATA_TAKEN) {
      nextCursor2 = thisUserFollowing[AMOUNT_OF_DATA_TAKEN - 1].id;
    }

    if (!existingFollow) {
      return NextResponse.json({
        data: thisFollower,
        data2: thisUserFollowing,
        nextCursor1,
        nextCursor2,
        response: "JUST FOLLOWED",
      });
    }

    return NextResponse.json({
      data: thisFollower,
      data2: thisUserFollowing,
      nextCursor1,
      nextCursor2,
      response: "FOLLOWED",
    });
  } catch (err) {
    return NextResponse.json({ error: "Internal Error", status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { slug: string[] } }
) {
  try {
    if (!params.slug[0]) {
      return NextResponse.json({ response: "Invalid email", status: 400 });
    }

    if (!params.slug[1]) {
      return NextResponse.json({ response: "Invalid id", status: 400 });
    }

    const thisIdUser = await prisma.user.findUnique({
      where: {
        email: params.slug[0],
      },
      select: {
        id: true,
      },
    });

    if (!thisIdUser) {
      return NextResponse.json({
        response: "Coulnot find the user",
        status: 404,
      });
    }

    const idExistingFollow = await prisma.follow.findFirst({
      where: {
        followerId: params.slug[1],
        followingId: thisIdUser.id as string,
      },
      select: { id: true },
    });

    if (!idExistingFollow) {
      return NextResponse.json({ response: "user could not be found" });
    }

    const deletedData = await prisma.follow.delete({
      where: {
        id: idExistingFollow.id as string,
      },
    });

    if (!deletedData) {
      return NextResponse.json({
        response: "Couldnot unfollow it",
        status: 404,
      });
    }

    return NextResponse.json({ response: "NOT FOLLOWED" });
  } catch (err) {
    return NextResponse.json({ error: "Internal Error", status: 500 });
  }
}
