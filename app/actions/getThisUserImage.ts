import prisma from "@/libs/prisma";
import getSession from "./getSession";

export default async function getThisUser() {
  const session = await getSession();
  try {
    if (!session?.user.email) {
      return null;
    }

    const thisUser = await prisma.user.findUnique({
      where: { email: session.user.email as string },
      select: {
        image: true,
      },
    });

    if (!thisUser) {
      return null;
    }

    return thisUser;
  } catch (err) {
    return null;
  }
}
