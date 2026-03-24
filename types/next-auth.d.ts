import { DefaultSession } from "next-auth";
import { JWT as DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  /**
   * The shape of the user object returned in the OAuth providers' `profile` callback,
   * or the second parameter of the `session` callback, when using a database.
   */
  interface User {
    id: string;
    email: string;
  }
  /**
   * Returned by `useSession`, `auth`, contains information about the active session.
   */
  interface Session {
    user: {
      id: string;
      email: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
  interface JWT extends DefaultJWT {
    id: string;
    /** OpenID ID Token */
    idToken?: string;
  }
}
