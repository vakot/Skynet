import NextAuth, { NextAuthOptions } from 'next-auth'
import DiscordProvider from 'next-auth/providers/discord'

const scopes = ['guilds', 'identify', 'email']

export const authOptions: NextAuthOptions = {
  secret: process.env.AUTH_SECRET,
  providers: [
    DiscordProvider({
      clientId: process.env.CLIENT_ID ?? '',
      clientSecret: process.env.CLIENT_SECRET ?? '',
      authorization: { params: { scope: scopes.join(' ') } },
    }),
  ],
  callbacks: {
    signIn: async () => {
      return true
    },
    redirect: async ({ url, baseUrl }) => {
      return baseUrl
    },
    session: async ({ session, user, token }) => {
      return { ...session, user: { ...session.user, id: token.sub } }
    },
    jwt: async ({ token, user, account, profile }) => {
      return token
    },
  },
  pages: {
    signIn: '/auth',
  },
}

export default NextAuth(authOptions)
