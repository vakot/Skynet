import NextAuth, { NextAuthOptions } from 'next-auth'
import DiscordProvider from 'next-auth/providers/discord'

const scopes = ['guilds', 'identify', 'email']

export const authOptions: NextAuthOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.CLIENT_ID ?? '',
      clientSecret: process.env.CLIENT_SECRET ?? '',
      authorization: { params: { scope: scopes.join(' ') } },
    }),
  ],
}

export default NextAuth(authOptions)
