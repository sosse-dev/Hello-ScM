import { getVerificationTokenByToken } from "@/app/actions/data/getVerificationToken";
import { getUserByEmail } from "@/app/actions/getUserByEmail";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  const { token } = await req.json();
  const cekToken = await getVerificationTokenByToken(token);

  if (!cekToken) {
    return NextResponse.json({ error: "Token invalid!" });
  }

  const hasExpired = new Date(cekToken.expires) < new Date();

  if (hasExpired) {
    return NextResponse.json({ error: "Token has been expired!" });
  }

  const cekUser = await getUserByEmail(cekToken.email);

  if (!cekUser) {
    return NextResponse.json({ error: "User has not been signed in!" });
  }

  await prisma.user.update({
    where: {
      id: cekUser.id,
    },
    data: {
      emailVerified: new Date(),
      email: cekToken.email,
    },
  });

  await prisma.verficationToken.delete({
    where: {
      id: cekToken.id,
    },
  });

  return NextResponse.json({ success: "Email has been verified!" });
}
