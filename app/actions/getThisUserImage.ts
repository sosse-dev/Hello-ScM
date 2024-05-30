import { prisma } from "@/lib/prisma"
import getSession from "./getSession";

export default async function getThisUser() {
  const session = await getSession();
  try {
    return session?.user.image;
  } catch (err) {
    return null;
  }
}
