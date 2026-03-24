import Credentials from "next-auth/providers/credentials";
import { connectToDB } from "./db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextAuthConfig } from "next-auth";

export const authOptions: NextAuthConfig = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "Enter your email",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Enter your password",
        },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials.password) {
          throw new Error("Email and password are required.");
        }
        // logic to verify if the user exists
        try {
          await connectToDB();
          const user = await User.findOne({ email: credentials.email });
          if (!user) {
            throw new Error("Invalid credentials.");
          }
          const isMatch = await bcrypt.compare(
            credentials.password,
            user.password,
          );
          if (!isMatch) {
            throw new Error("Invalid credentials.");
          }
          return { id: user?._id?.toString(), email: user.email };
        } catch (err) {
          console.error("Error connecting to DB or finding user:", err);
          throw new Error("An error occurred while verifying credentials.");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
    async redirect({ baseUrl }) {
      return baseUrl;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/signin",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};
