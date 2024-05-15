import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"

export async function GET(
  req: Request,
  { params }: { params: { slug: number } }
) {
  try {
    if (!params.slug) {
      return NextResponse.json({ response: "Invalid Number", status: 400 });
    }

    const data = await prisma.post.findMany({
      include: {
        user: true,
      },
      take: Number(params.slug),
    });

    if (!data) {
      return NextResponse.json({
        response: "Coulnot find any post",
        status: 404,
      });
    }

    return NextResponse.json({ data: data, response: "FOUND" });
  } catch (err) {
    return NextResponse.json({ error: "Internal Error", status: 500 });
  }
}
