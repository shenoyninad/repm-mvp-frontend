import NextAuth from "next-auth/next";
import { apiHeader } from "@config/config";
import apiClient from "@shared/utility/api-util";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},

      async authorize(credentials) {
        const { username, password } = credentials;
        const requestBody = {
          email: username,
          password,
        };

        const userResponse = await apiClient.post(
          `/users/login`,
          requestBody,
          apiHeader
        );

        const user = {
          name: `${userResponse.data.firstname} ${userResponse.data.lastname}`,
          email: userResponse.data.email,
        };

        return user;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
