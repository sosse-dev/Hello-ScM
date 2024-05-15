import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${process.env.NEXT_URL}/auth/new-password?token=${token}`;

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Atur ulang sandi anda",
    html: `<p>Klik <a href="${resetLink}">di sini</a> untuk atur ulang sandi.<p>`,
  });
};

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${process.env.NEXT_URL}/auth/new-verification?token=${token}`;

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Konfirmasi email anda!",
    html: `<p>Klik <a href="${confirmLink}">di sini</a> untuk konfirmasi email.<p>`,
  });
};

// TODO: You might ask why here?, translate every indonesian word to english!
// TODO: Proximity API? to filter bad words!!!
