import { getUserByEmail } from "@/app/actions/getUserByEmail";
import { sendVerificationEmail } from "@/lib/mail";
import { generateVerificationToken } from "@/lib/tokens";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { LoginSchema } from "@/types/schemaZod";
import { signIn } from "next-auth/react";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function POST(req: Request) {
  const values: z.infer<typeof LoginSchema> = await req.json();
  const validateFields = await LoginSchema.safeParse(values);

  if (!validateFields.success) {
    return NextResponse.json({ error: "Invalid input!" });
  }

  const { email, password } = validateFields.data;

  const cekUser = await getUserByEmail(email);

  if (!cekUser || !cekUser.email || !cekUser.password) {
    return NextResponse.json({ error: "Email or passwords is wrong!" });
  }

  if (!cekUser.emailVerified) {
    const verificationToken = await generateVerificationToken(cekUser.email);

    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );

    return NextResponse.json({
      success: "Verification email has been sended!",
    });
  }

  try {
    // signIn("credentials", {
    //   email: email,
    //   password: password,
    // });

    return NextResponse.json({ success: "Login success!" });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong!" });
    // kenapa throw error? agar di redirectTo berjalan, kenapa? tak tahu
    throw error;
  }
}
