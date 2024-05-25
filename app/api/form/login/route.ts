import getUserByEmailAndPassword from "@/app/actions/getUserByEmailAndPassword";
import { sendVerificationEmail } from "@/lib/mail";
import { generateVerificationToken } from "@/lib/tokens";
import { LoginSchema } from "@/types/schemaZod";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function POST(req: Request) {
  const values: z.infer<typeof LoginSchema> = await req.json();
  const validateFields = await LoginSchema.safeParse(values);

  if (!validateFields.success) {
    return NextResponse.json({ error: "Invalid input!" }, { status: 400 });
  }

  const { email, password } = validateFields.data;

  const cekUser = await getUserByEmailAndPassword(email, password);

  if (!cekUser || !cekUser.email || !cekUser.password) {
    return NextResponse.json({ error: "Email or password is wrong!" });
  }

  if (cekUser && !cekUser.emailVerified) {
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
    return NextResponse.json({ success: "Login success!" });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong!" },
      { status: 500 }
    );
  }
}
