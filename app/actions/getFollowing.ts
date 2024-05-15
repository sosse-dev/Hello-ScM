import getSession from "./getSession";
import { prisma } from "@/lib/prisma"

export default async function getFollowing() {
  const session = await getSession();
  try {
    if (!session) {
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
