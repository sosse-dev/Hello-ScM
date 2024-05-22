import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { AuthOptions } from "next-auth";
import { prisma } from "@/lib/prisma";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import getUserById from "@/app/actions/getUserById";
import { LoginSchema } from "@/types/schemaZod";
import bcrypt from "bcryptjs";
import { getUserByEmail } from "@/app/actions/getUserByEmail";
import generator from "generate-password";
import { getUserByUsername } from "@/lib/getUserByUsername";
import { Role } from "@prisma/client";

export const authOption: AuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 1 * 24 * 60 * 60, // satu hari untuk expire rencana
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      async profile(profile) {
        const username = generator.generate({ length: 10, numbers: true });
        const cekUser = await getUserByUsername(username);

        if (cekUser) {
          return profile();
        }

        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          username,
        };
      },
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      type: "credentials",
      credentials: {
        name: { label: "Name", type: "text" },
        username: { label: "Username", type: "text" },
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const validateFields = LoginSchema.safeParse(credentials);

          if (validateFields.success) {
            const { email, password } = validateFields.data;

            const user = await getUserByEmail(email);

            if (!user || !user.password) return null;

            const sandiMatch = await bcrypt.compare(password, user.password);

            if (sandiMatch)
              return {
                id: user.id,
                name: user.name,
                username: user.username,
                email: user.email,
                password: user.password,
              };
          }
          return null;
        } catch (error) {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "credentials") return true;

      const cekUser = await getUserById(user.id as string);

      if (!cekUser?.emailVerified) return false;

      return true;
    },
    async jwt({ token, trigger, session }) {
      if (trigger === "update") {
        token.name = session.user.name as string;
        token.username = session.user.username as string;
        token.desc = session.user.desc as string;
        token.isUsernameMade = session.user.isUsernameMade as boolean;
        token.emailVerified = session.user.emailVerified as Date;
        token.image = session.user.image as string;

        if (session.user.role) {
          token.role = session.user.role;
        }

        return token;
      }

      const getUser = await prisma.user.findFirst({
        where: {
          email: session?.user.email as string,
        },
      });

      token.id = getUser?.id as string;
      token.username = getUser?.username as string;
      token.role = getUser?.role as Role;
      token.desc = getUser?.desc as string;
      token.isUsernameMade = getUser?.isUsernameMade as boolean;
      token.emailVerified = getUser?.emailVerified as Date;
      token.image = getUser?.image as string;

      return { ...token, ...session };
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.username = token.username as string;
        session.user.desc = token.desc as string;
        session.user.isUsernameMade = token.isUsernameMade as boolean;
        session.user.emailVerified = token?.emailVerified as Date;
        session.user.image = token.image as string;
      }

      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.AUTH_SECRET,
};
