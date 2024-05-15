import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { username: string } }
) {
  try {
    if (!params.username) {
      return NextResponse.json({ response: "Invalid username", status: 400 });
    }

    const data = await prisma.user.findFirst({
      where: { username: params.username },
      select: { id: true },
    });

    if (!data) {
      return NextResponse.json({
        response: "Coulnot find any user",
        status: 404,
      });
    }

    return NextResponse.json({ data: data, response: "GET" });
  } catch (err) {
    return NextResponse.json({ error: "Internal Error", status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { username: string } }
) {
  try {
    const data = await prisma.user.delete({
      where: {
        username: params.username,
      },
    });

    return NextResponse.json({ data: data, response: "GET" });
  } catch (err) {
    return NextResponse.json({ error: "Internal Error", status: 500 });
  }
}
