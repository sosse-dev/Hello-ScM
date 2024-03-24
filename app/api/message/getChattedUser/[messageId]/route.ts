import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import getSession from "@/app/actions/getSession";

export async function GET(
  req: Request,
  { params }: { params: { messageId: string } }
) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ response: "Unauthorized", status: 401 });
    }

    const data = await prisma.message.findFirst({
      where: { id: params.messageId },
      include: {
        receiver: true,
        sender: true,
      },
    });

    if (!data) {
      return NextResponse.json({
        response: "Coulnot find the message",
        status: 404,
      });
    }

    if (data.senderId !== session?.user.id) {
      return NextResponse.json({ data: data.sender });
    }

    if (data.receiverId !== session?.user.id) {
      return NextResponse.json({ data: data.receiver });
    }

    return NextResponse.json({ response: "Something went wrong" });
  } catch (err) {
    return NextResponse.json({ error: "Internal Error", status: 500 });
  }
}
