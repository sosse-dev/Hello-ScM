import { prisma } from "@/lib/prisma"

export default async function getAllPosts() {
  try {
    const posts = await prisma.post.findMany({
      include: {
        user: true,
      },
    });

    if (!posts) {
      return null;
    }

    return posts;
  } catch (err) {
    return null;
  }
}
