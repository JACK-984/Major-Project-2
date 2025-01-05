import NextAuth, { type DefaultSession } from "next-auth";
import { type DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    accessToken?: string;
    refreshToken?: string;
    // stripeConnectedLinked?: boolean;
  }
}

declare module "next-auth" {
  interface User extends DefaultUser {
    role?: string;
    // stripeConnectedLinked?: boolean;
  }
  interface Session {
    accessToken?: string;
    refreshToken?: string;
    user: {
      id: string;
      role: string;
      //   stripeConnectedLinked: boolean;
    } & DefaultSession["user"];
  }
}
