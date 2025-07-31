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

  // Just remove session.strategy if you want default DB sessions (or keep jwt for stateless)
  // Remove jwt and session callbacks unless you need accessToken on client

  // Optional: Add database config if you want persistent sessions

});
