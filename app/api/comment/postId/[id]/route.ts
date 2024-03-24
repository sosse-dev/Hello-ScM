import prisma from "@/libs/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await prisma.comment.findMany({
      where: { postId: params.id as string },
      include: { user: true },
    });

    if (!data) {
      return NextResponse.json({ response: "Invalid id", status: 400 });
    }

    return NextResponse.json({ data: data, response: "SENDED" });
  } catch (err) {
    return NextResponse.json({ error: "Internal Error", status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await prisma.comment.delete({
      where: { id: params.id as string },
    });

    if (!data) {
      return NextResponse.json({ response: "Invalid id", status: 400 });
    }

    return NextResponse.json({ data: data, response: "SENDED" });
  } catch (err) {
    return NextResponse.json({ error: "Internal Error", status: 500 });
  }
}
