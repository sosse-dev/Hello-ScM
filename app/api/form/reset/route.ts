import { getUserByEmail } from "@/app/actions/getUserByEmail";
import { sendPasswordResetEmail } from "@/lib/mail";
import { generatePasswordResetToken } from "@/lib/tokens";
import { ResetSchema } from "@/types/schemaZod";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function POST(req: Request) {
    const values: z.infer<typeof ResetSchema> = await req.json()
    const validateFields = await ResetSchema.safeParse(values);

  if (!validateFields.success) {
    return NextResponse.json({ error: "Invalid input!" });
  }

  const { email } = validateFields.data;

  const cekUser = await getUserByEmail(email);

  if (!cekUser) {
    return NextResponse.json({ error: "Email not found!" });
  }

  const passwordResetToken = await generatePasswordResetToken(email);
  await sendPasswordResetEmail(
    passwordResetToken.email,
    passwordResetToken.token
  );

  return NextResponse.json({ success: "Token has been sended!" });
}