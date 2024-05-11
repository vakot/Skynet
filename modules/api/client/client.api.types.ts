import { User } from 'discord.js'

export type GetClientResponse = Omit<User, 'avatarURL'> & {
  avatarURL: string | null
}
export type GetClientRequest = void
