import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { postId: string } }
) {
  try {
    if (!params.postId) {
      return NextResponse.json({ response: "Invalid Post Id", status: 400 });
    }

    const data = await prisma.post.findFirst({
      where: { id: params.postId as string },
      include: { user: true, comments: true },
    });

    if (!data) {
      return NextResponse.json({
        response: "Coulnot find the post",
        status: 404,
      });
    }

    return NextResponse.json({ data: data, response: "SENDED" });
  } catch (err) {
    return NextResponse.json({ error: "Internal Error", status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { postId: string } }
) {
  try {
    if (!params.postId) {
      return NextResponse.json({ response: "Invalid Post Id", status: 400 });
    }

    const data = await prisma.post.delete({
      where: { id: params.postId as string },
    });

    if (!data) {
      return NextResponse.json({
        response: "Coulnot delete the post",
        status: 404,
      });
    }

    return NextResponse.json({ response: "DELETED" });
  } catch (err) {
    return NextResponse.json({ response: "Internal Error", status: 500 });
  }
}
