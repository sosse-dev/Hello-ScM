import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: Request,
  { params }: { params: { email: string } }
) {
  const { name, desc, image } = await req.json();
  try {
    if (!params.email) {
      return NextResponse.json({ error: "Invalid email", status: 400 });
    }
    const currentData = await prisma.user.findFirst({
      where: { email: params.email as string },
    });

    await prisma.user.update({
      where: { email: params.email as string },
      data: {
        name: name ?? (currentData?.name as string),
        desc: desc ?? (currentData?.desc as string),
        image: image ?? (currentData?.image as string),
      },
    });

    return NextResponse.json({ success: "Update Success!" });
  } catch (err) {
    return NextResponse.json({ error: "internal Error", status: 500 });
  }
}
