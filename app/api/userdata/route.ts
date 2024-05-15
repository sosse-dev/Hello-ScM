import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const data = await prisma.user.findMany();

    if (!data) {
      return NextResponse.json({
        response: "Coulnot find any user",
        status: 404,
      });
    }

    return NextResponse.json({ data: data, response: "FOUND" });
  } catch (err) {
    return NextResponse.json({ error: "Internal Error", status: 500 });
  }
}
