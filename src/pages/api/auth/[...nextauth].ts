import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          scope: "openid email profile",
        },
      },
    }),
  ],
  secret: "74b7a3f957cff83bdc2a072ddc883056e331b79919c8c0d795392a0310125737", // ✅ required for production deployments

  // Optional: session config
  session: {
    strategy: "jwt", // or omit for database sessions
  },
});
