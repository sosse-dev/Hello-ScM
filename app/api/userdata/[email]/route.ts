import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";

export async function GET(
  req: Request,
  { params }: { params: { email: string } }
) {
  try {
    if (!params.email) {
      return NextResponse.json({ response: "Invalid email", status: 400 });
    }

    const data = await prisma.user.findFirst({
      where: { email: params.email },
      select: { id: true, username: true, desc: true },
    });

    if (!data) {
      return NextResponse.json({
        response: "Coulnot find the user",
        status: 404,
      });
    }
    return NextResponse.json({ data: data, response: "GET" });
  } catch (err) {
    return NextResponse.json({ error: "Internal Error", status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: { email: string } }
) {
  const { username } = await req.json();
  try {
    if (!username) {
      return NextResponse.json({ response: "Invalid username", status: 400 });
    }

    if (!params.email) {
      return NextResponse.json({ response: "Invalid email", status: 400 });
    }

    const existingUsername = await prisma.user.findFirst({
      where: { username: username },
    });

    if (existingUsername) {
      return NextResponse.json({ response: "EXIST" });
    }

    const data = await prisma.user.update({
      where: { email: params.email as string },
      data: {
        username: username,
      },
    });

    if (!data) {
      return NextResponse.json({
        response: "Coulnot update the user",
        status: 404,
      });
    }

    return NextResponse.json({ data: data, response: "UPDATED" });
  } catch (err) {
    return NextResponse.json({ error: "Internal Error", status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { email: string } }
) {
  const { username, name, desc } = await req.json();
  try {
    if (!username) {
      return NextResponse.json({ response: "Invalid username", status: 400 });
    }

    if (!params.email) {
      return NextResponse.json({ response: "Invalid email", status: 400 });
    }

    const existingUsername = await prisma.user.findFirst({
      where: { username: username },
    });

    if (existingUsername && desc && name) {
      const currentData = await prisma.user.findFirst({
        where: { email: params.email as string },
      });

      const data = await prisma.user.update({
        where: { email: params.email as string },
        data: {
          name: name ?? (currentData?.name as string),
          desc: desc ?? (currentData?.desc as string),
        },
      });

      if (!data) {
        return NextResponse.json({
          response: "Coulnot update the user",
          status: 404,
        });
      }

      return NextResponse.json({ response: "Updated without username" });
    }

    const currentData = await prisma.user.findFirst({
      where: { email: params.email as string },
    });

    const data = await prisma.user.update({
      where: { email: params.email as string },
      data: {
        name: name ?? (currentData?.name as string),
        username: username ?? (currentData?.username as string),
        desc: desc ?? (currentData?.desc as string),
      },
    });

    if (!data) {
      return NextResponse.json({
        response: "Couldnot update the user",
        status: 404,
      });
    }

    return NextResponse.json({ data: data, response: "UPDATED" });
  } catch (err) {
    return NextResponse.json({ error: "internal Error", status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { email: string } }
) {
  try {
    if (!params.email) {
      return NextResponse.json({ response: "Invalid email", status: 400 });
    }

    const dataId = await prisma.user.findFirst({
      where: { email: params.email },
      select: { id: true },
    });

    if (!dataId) {
      return NextResponse.json({
        response: "Coulnot find the User Id",
        status: 404,
      });
    }

    const data = await prisma.user.delete({
      where: { id: dataId.id as string },
    });

    if (!data) {
      return NextResponse.json({
        response: "Couldnot delete the user",
        status: 404,
      });
    }

    return NextResponse.json({ data: data, response: "DELETED" });
  } catch (err) {
    return NextResponse.json({ error: "internal Error", status: 500 });
  }
}
