import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { username: string } }
) {
  try {
    if (!params.username) {
      return NextResponse.json({ data: null, error: "Invalid Username", status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: {
        username: params.username,
      },
    });

    return NextResponse.json({ data: user, success: "Done" });
  } catch {
    return NextResponse.json({ data: null, error: "Internal Error", status: 500 });
  }
}
