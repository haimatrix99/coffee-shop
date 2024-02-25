import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
// My imports.
import validateCredentials from "../../../utils/db/validate-credentials";
import prisma from "utils/db/prisma";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      type: "credentials",
      credentials: {},
      async authorize(credentials) {
        const { phoneNumber, password } = credentials as {
          phoneNumber: string;
          password: string;
        };

        // Get user db document and validate credentials.
        let responseData = null;
        try {
          responseData = await validateCredentials(phoneNumber, password);
          if (!responseData) {
            throw new Error();
          }
        } catch (error) {
          throw new Error(
            responseData
              ? responseData.errorMessage
              : "Failed to connect to the database!"
          );
        }

        // No user was found in our database.
        if (!responseData.user) {
          throw new Error(responseData.errorMessage);
        }

        // Return user object.
        return {
          id: responseData.user.id,
          phoneNumber: responseData.user.phoneNumber,
          name: `${responseData.user.firstName} ${responseData.user.lastName}`,
          isAdmin: responseData.user.isAdmin,
        };
      },
    }),
  ],
  callbacks: {
    session: async ({ session, token}) => {
      if (session?.user && token.sub) {
        const user = await prisma.user.findUnique({
          where: {
            id: token.sub,
          },
        });

        session.user.id = token.sub;
        if (user) {
          session.user.phoneNumber = user.phoneNumber;
          session.user.isAdmin = user.isAdmin;
        }
      }
      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
};

// Handles all other auth routes.
export default NextAuth(authOptions);
