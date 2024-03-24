import getSession from "./getSession";
import prisma from "@/libs/prisma";

export default async function getFollowing() {
  const session = await getSession();
  try {
    if (!session) {
      console.log("no session");
      return null;
    }

    const thisUserFollowing = await prisma.follow.findMany({
      where: {
        followingId: session?.user.id as string,
      },
      include: {
        follower: true,
      },
    });

    if (!thisUserFollowing) {
      return null;
    }

    return thisUserFollowing ?? [];
  } catch (err) {
    return null;
  }
}
