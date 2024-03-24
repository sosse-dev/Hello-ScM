import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { AuthOptions } from "next-auth";
import prisma from "@/libs/prisma";
import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";

export const authOption: AuthOptions = {
  session: {
    strategy: "jwt",
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: profile.role ? profile.role : "user",
        };
      },
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  //     CredentialsProvider({
  //         name: "credentials",
  //         credentials: {
  //             name: {
  //                 label: "Name",
  //                 type: "text",
  //                 placeholder: "Enter your name"
  //             },
  //             username: {
  //                 label: "Username",
  //                 type: "text",
  //                 placeholder: "Username"
  //             },
  //             email: {
  //                 label: "Email",
  //                 type: "email",
  //                 placeholder: "Email"
  //             },
  //             password: {
  //                 label: "Password",
  //                 type: "password",
  //                 placeholder: "Password"
  //             }
  //         },
  //         async authorize(credentials, req) {
  // credentials gotten from the form sign up
  //             console.log(credentials, "crendetial")

  //             if(!credentials?.name && credentials?.username && credentials?.email && credentials.password) {
  //                 return null
  //             }

  //             return null
  //         }
  //     })
  // ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (trigger === "update") {
        return { ...token, ...session.user };
      }
      return { ...token, ...user };
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }

      const data = await prisma.user.findUnique({
        where: { email: session?.user.email as string },
        select: { id: true, username: true, desc: true },
      });

      if (data) {
        session.user.id = data.id as string;
        session.user.username = data.username as string;
        session.user.desc = data.desc as string;
      }

      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
};

const handler = NextAuth(authOption);

export { handler as GET, handler as POST };
