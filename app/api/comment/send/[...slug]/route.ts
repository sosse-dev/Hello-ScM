import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { slug: string[] } }
) {
  const comment = await req.json();
  try {
    const data = await prisma.comment.create({
      data: {
        comment: comment as string,
        postId: params.slug[0],
        userId: params.slug[1],
      },
    });

    if (!data) {
      return NextResponse.json({
        response: "Coulnot create the comment",
        status: 404,
      });
    }

    return NextResponse.json({ data: data, response: "SENDED" });
  } catch (err) {
    return NextResponse.json({ error: "Internal Error", status: 500 });
  }
}
