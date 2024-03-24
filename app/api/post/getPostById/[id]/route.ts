import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    if(!params.id) {
      return NextResponse.json({ response: "Invalid Id", status: 400 })
    }

    const data = await prisma.post.findFirst({
      where: {id: params.id},
      select: {id: true}
    });

    if (!data) {
      return NextResponse.json({ response: "Coulnot find the post", status: 404 });
    }

    return NextResponse.json({ data: data, response: "FOUND" });
  } catch (err) {
    return NextResponse.json({ error: "Internal Error", status: 500 });
  }
}
