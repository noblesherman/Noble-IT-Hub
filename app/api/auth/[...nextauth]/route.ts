import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";

// Export authOptions for getServerSession
export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!
    })
  ],
  session: {
    strategy: "jwt"
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };