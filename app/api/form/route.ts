
import bcrypt from "bcryptjs";
import { SignupSchema } from "@/types/schemaZod";
import { z } from "zod";
import { getUserByEmail } from "@/app/actions/getUserByEmail";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const values: z.infer<typeof SignupSchema> = await req.json()
  const validateFields = SignupSchema.safeParse(values);

  if (!validateFields.success) {
    return NextResponse.json({ error: "Invalid input!" });
  }

  const { email, sandi, name, gambar, username } = validateFields.data;

  const cekUsername = await prisma?.user.findFirst({
    where: {
      username
    },
    select: {
      username: true
    }
  })

  if(cekUsername) {
    return NextResponse.json({ error: "Username already taken!" });
  }

  // whitespace only check
  const str = name;
  const regex = /^\s+$/;
  const invalid = regex.test(str);

  if (invalid) {
    return NextResponse.json({ error: "Your name is empty!" });
  }

  const hashedPassword = await bcrypt.hash(sandi, 10);

  const cekUser = await getUserByEmail(email);

  if (cekUser) {
    return NextResponse.json({ error: "Email has been registered!" });
  }

  await prisma?.user.create({
    data: {
      name,
      email,
      image: gambar ?? null,
      password: hashedPassword,
      username,
      isUsernameMade: true
    },
  });
  //! INFO: ini buat kirim verifikasi token!
  // const verificationToken = await generateVerificationToken(email);

  // await sendVerificationEmail(verificationToken.email, verificationToken.token);

  return NextResponse.json({ success: "Signed up!" });
};
