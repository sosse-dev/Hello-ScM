import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"

export async function GET(
  req: Request,
  { params }: { params: { username: string } }
) {
  try {
    if (!params.username) {
      return NextResponse.json({ response: "Invalid username", status: 400 });
    }

    const data = await prisma.user.findFirst({
      where: { username: params.username as string },
      select: { id: true, name: true, image: true, username: true, desc: true, email: true},
    });

    if (!data) {
      return NextResponse.json({ response: "Coulnot find the user", status: 404 });
    }

    return NextResponse.json({ data: data, response: "FOUND" });
  } catch (err) {
    return NextResponse.json({ error: "Internal Error", status: 500 });
  }
}
