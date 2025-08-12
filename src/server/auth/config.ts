import NextAuth, { type NextAuthConfig } from "next-auth";
import Twitter from "next-auth/providers/twitter";
import { createUser } from "./utils/create-user";

declare module "next-auth" {
  interface Session {
    user: {
      name: string;
      twitterId: string;
      profile_image_url: string;
      username: string;
    };
  }
}

export const authConfig = {
  providers: [Twitter],
  callbacks: {
    authorized: async ({ auth }) => {
      return !!auth;
    },
    async signIn({ profile }) {
      const twitterUser = profile as {
        data: {
          username: string;
          name: string;
          id: string;
          profile_image_url: string;
        };
      };

      const { success } = await createUser({
        twitterId: twitterUser.data.id,
        twitterUsername: twitterUser.data.username,
        twitterImage: twitterUser.data.profile_image_url,
        twitterDisplayName: twitterUser.data.name,
      });

      return success;
    },
    async jwt({ token, profile }) {
      if (profile) {
        token.data = (
          profile as {
            data: {
              username: string;
              name: string;
              id: string;
              profile_image_url: string;
            };
          }
        ).data;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token.data as {
        name: string;
        twitterId: string;
        id: string;
        profile_image_url: string;
        username: string;
        email: string;
        emailVerified: Date | null;
      };

      return {
        ...session,
        user: {
          twitterId: session.user.id,
          profile_image_url: session.user.profile_image_url,
          username: session.user.username,
          email: session.user.email,
          emailVerified: session.user.emailVerified,
        },
      };
    },
  },
  pages: {
    signIn: "/signin",
    error: "/signin",
  },
} satisfies NextAuthConfig;

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig);
