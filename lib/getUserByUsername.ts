import { prisma } from "@/lib/prisma";
export const getUserByUsername = async (username: string) => {
    const user = await prisma.user.findFirst({
        where: {
            username
        }
    })
  
    return user;
  };
  