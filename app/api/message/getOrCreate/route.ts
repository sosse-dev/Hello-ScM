import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userOne = searchParams.get("receiverId");
    const userTwo = searchParams.get("senderId");

    let message = null;

    message = await prisma.message.findFirst({
      where: {
        AND: [{ receiverId: userOne }, { senderId: userTwo }],
      },
      include: { 
        receiver: true,
        sender: true,
      },
    });

    if(!message) {
      message = await prisma.message.findFirst({
        where: {
          AND: [{ receiverId: userTwo }, { senderId: userOne }],
        },
        include: { 
          receiver: true,
          sender: true,
        },
      });

      if(!message) {
        message = await prisma.message.create({
            data: {
                receiverId: userOne,
                senderId: userTwo
            },
            include: {
                receiver: true,
                sender: true
            }
        })
      }
    }

    if(!message) {
        return NextResponse.json({ response: "Couldnot follow it", status: 500 })
    }

    return NextResponse.json({ message })
  } catch (err) {
    return NextResponse.json({ error: "Internal Error", status: 500 })
  }
}
