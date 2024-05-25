import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export default async function getUserByEmailAndPassword(
  email: string,
  password: string
) {
  const user = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (!user || !user.password) return null;

  const sandiMatch = await bcrypt.compare(password, user.password);

  if (sandiMatch) return user;

  return null;
}
