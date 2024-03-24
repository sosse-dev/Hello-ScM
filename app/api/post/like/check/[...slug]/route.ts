import prisma from "@/libs/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { slug: string[] } }
) {
  try {
    if (!params.slug[0]) {
      return NextResponse.json({ response: "Invalid User Id", status: 400 });
    }

    if (!params.slug[1]) {
      return NextResponse.json({ response: "Invalid Post Id", status: 400 });
    }

    const data = await prisma.like.findFirst({
      where: { userId: params.slug[0], postId: params.slug[1] },
    });

    if (!data) {
      return NextResponse.json({
        response: "Couldnot find any post",
        status: 404,
      });
    }

    return NextResponse.json({ data: data, response: "FOUND" });
  } catch (err) {
    return NextResponse.json({ error: "Internal Error", status: 500 });
  }
}
