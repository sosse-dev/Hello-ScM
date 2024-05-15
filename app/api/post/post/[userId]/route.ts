import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"

export async function POST(
  req: Request,
  { params }: { params: { userId: string } }
) {
  // VALIDASI BACKEND!
  const dataPost = await req.json();
  try {
    if (!params.userId) {
      return NextResponse.json({ response: "Invalid User Id", status: 400 });
    }

    if (!dataPost.title) {
      return NextResponse.json({ response: "Invalid Title", status: 400 });
    }

    const data = await prisma.post.create({
      data: {
        title: dataPost.title,
        desc: dataPost.desc,
        image: dataPost.image,
        userId: params.userId,
      },
    });

    if (!data) {
      return NextResponse.json({
        response: "Coulnot create the post",
        status: 400,
      });
    }

    return NextResponse.json({ data: data, response: "FOUND" });
  } catch (err) {
    return NextResponse.json({ error: "Internal Error", status: 500 });
  }
}
