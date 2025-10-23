import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

/* ----------------------------
   ✅ NextAuth Configuration
----------------------------- */
export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectDB();

        const user = await User.findOne({ email: credentials?.email });
        if (!user) throw new Error("User not found");

        // 🚫 Block inactive users
        if (!user.isActive) {
          throw new Error("Your account is inactive. Please contact admin.");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials!.password,
          user.password
        );
        if (!isPasswordValid) throw new Error("Invalid email or password");

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt" as const, // ✅ Fixes TypeScript error
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

/* ----------------------------
   ✅ Handler Exports (App Router)
----------------------------- */
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
 