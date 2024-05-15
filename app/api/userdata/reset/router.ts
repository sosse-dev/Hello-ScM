import { ResetSchema } from "@/types/schemaZod";
import * as z from "zod";
import { getUserByEmail } from "@/app/actions/getUserByEmail";
import { generatePasswordResetToken } from "@/lib/tokens";
import { sendPasswordResetEmail } from "@/lib/mail";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const values = await req.json()
    
      const validateFields = await ResetSchema.safeParse(values);

      if (!validateFields.success) {
        return { error: "Email salah!" };
      }

      const { email } = validateFields.data;

      const cekUser = await getUserByEmail(email);

      if (!cekUser) {
        return NextResponse.json({ error: "Email tidak ditemukan!" });
      }

      const passwordResetToken = await generatePasswordResetToken(email);
      await sendPasswordResetEmail(
        passwordResetToken.email,
        passwordResetToken.token
      );

      return NextResponse.json({ success: "Reset email dikirim!" });
  } catch {
    return NextResponse.json({ error: "Internal Error", status: 500 });
  }
}
