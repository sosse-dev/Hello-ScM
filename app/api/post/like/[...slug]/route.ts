import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { slug: string[] } }
) {
  try {
    if (!params.slug[1]) {
      return NextResponse.json({ response: "Invalid Post Id", status: 400 });
    }

    const data = await prisma.like.findMany({
      where: { postId: params.slug[1] },
    });

    if (!data) {
      return NextResponse.json({
        response: "Coulnot find any post",
        status: 404,
      });
    }

    return NextResponse.json({ data: data, response: "FOUND" });
  } catch (err) {
    return NextResponse.json({ error: "Internal Error", status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: { slug: string[] } }
) {
  try {
    if (!params.slug[0]) {
      return NextResponse.json({ response: "Invalid User Id", status: 400 });
    }

    if (!params.slug[1]) {
      return NextResponse.json({ response: "Invalid Post Id", status: 400 });
    }

    const liked = await prisma.like.create({
      data: { userId: params.slug[0], postId: params.slug[1] },
    });

    const likes = await prisma.like.findMany({
      where: { postId: params.slug[1] },
    });

    if (!likes) {
      return NextResponse.json({ response: "No Likes", status: 404 });
    }

    return NextResponse.json({ data: likes, response: "FOUND" });
  } catch (err) {
    return NextResponse.json({ error: "Internal Error", status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { slug: string[] } }
) {
  try {
    if (!params.slug[0]) {
      return NextResponse.json({ response: "Invalid Like Id", status: 400 });
    }

    if (!params.slug[1]) {
      return NextResponse.json({ response: "Invalid Post Id", status: 400 });
    }

    const deletedLike = await prisma.like.delete({
      where: { id: params.slug[0] },
    });

    if (!deletedLike) {
      return NextResponse.json({
        response: "Coulnot find the Like Id",
        status: 404,
      });
    }

    const data = await prisma.like.findMany({
      where: { postId: params.slug[1] },
    });

    if (!data) {
      return NextResponse.json({ response: "No Likes", status: 404 });
    }

    return NextResponse.json({ data: data, response: "FOUND" });
  } catch (err) {
    return NextResponse.json({ error: "Internal Error", status: 500 });
  }
}
