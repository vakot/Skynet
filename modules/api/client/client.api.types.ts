import { Guild, User } from 'discord.js'

export type GetClientResponse = Omit<User, 'avatarURL'> & {
  avatarURL: string | null
}
export type GetClientRequest = void

export type GetClientGuildsResponse = Array<
  Omit<Guild, 'iconURL'> & {
    iconURL: string | null
  }
>
export type GetClientGuildsRequest = {
  ids?: string[]
} | void

export type GetClientGuildResponse = Omit<Guild, 'iconURL'> & {
  iconURL: string | null
}

export type GetClientGuildRequest = string | undefined | void
