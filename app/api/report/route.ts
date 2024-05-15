import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  const { title, desc } = await req.json();
  try {
    if (!title) {
      return NextResponse.json({ response: "Title is required", status: 400 });
    }

    if (!desc) {
      return NextResponse.json({
        response: "Description is required",
        status: 400,
      });
    }

    const sendedReport = await prisma.report.create({
      data: {
        title,
        desc,
        category: "NOT CATEGORIZED",
      },
    });

    if (!sendedReport) {
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
    const reportId = searchParams.get("reportId")

    await prisma.report.delete({
      where: {
        id: reportId as string
      }
    })
    
    return NextResponse.json({response: "DELETED"})
  } catch (err) {
    return NextResponse.json({ error: "Internal Error", status: 500 });
  }
}
