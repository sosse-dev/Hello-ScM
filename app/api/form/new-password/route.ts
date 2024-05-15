import { NewPasswordSchema } from "@/types/schemaZod";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { getUserByEmail } from "@/app/actions/getUserByEmail";
import { getPasswordResetTokenByToken } from "@/app/actions/data/getPasswordResetToken";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  const values: {
    values: z.infer<typeof NewPasswordSchema>;
    token: string | null;
  } = await req.json();

  if (!values.token) {
    return NextResponse.json({ error: "There is no token!" });
  }

  const validateFields = NewPasswordSchema.safeParse(values.values);

  if (!validateFields.success) {
    return NextResponse.json({ error: "Invalid input!" });
  }

  const { password } = validateFields.data;

  const cekToken = await getPasswordResetTokenByToken(values.token);

  if (!cekToken) {
    return NextResponse.json({ error: "Invalid token!" });
  }

  const hasExpired = new Date(cekToken.expires) < new Date();

  if (hasExpired) {
    return NextResponse.json({ error: "Token has been expired!" });
  }

  const cekUser = await getUserByEmail(cekToken.email);

  if (!cekUser) {
    return NextResponse.json({ error: "Email has not been registered!" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: { id: cekUser.id },
    data: {
      password: hashedPassword,
    },
  });

  await prisma.passwordResetToken.delete({
    where: {
      id: cekToken.id,
    },
  });

  return NextResponse.json({ success: "Password recovery success!" });
}
