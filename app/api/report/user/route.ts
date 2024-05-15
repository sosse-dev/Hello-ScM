import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  const { title, desc, id }: { title: string; desc: string; id: string } =
    await req.json();
  try {
    if (!desc) {
      return NextResponse.json({
        response: "Description is required",
        status: 400,
      });
    }

    if (!id) {
      return NextResponse.json({
        response: "User Id is required",
        status: 400,
      });
    }

    const sendedReport = await prisma.report.create({
      data: {
        title: title ?? "User Report",
        desc,
        userId: id,
        category: "USER",
      },
    });

    if(!sendedReport) {
      return NextResponse.json({
        response: "Coulnot send the report",
        status: 400,
      });
    }

    return NextResponse.json({
      response: "SENDED",
    });
  } catch (err) {
    return NextResponse.json({ error: "Internal Error", status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId")

    await prisma.user.delete({
      where: {
        id: userId as string
      }
    })
    
    return NextResponse.json({response: "DELETED"})
  } catch (err) {
    return NextResponse.json({ error: "Internal Error", status: 500 });
  }
}