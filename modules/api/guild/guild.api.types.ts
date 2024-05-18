import { BaseGuild, Guild, GuildChannel } from 'discord.js'

export type GetGuildsResponse =
  | Array<
      Omit<BaseGuild, 'iconURL'> & {
        iconURL: string | null
      }
    >
  | undefined
export type GetGuildsRequest = {
  ids?: string[]
} | void

export type GetGuildResponse = Omit<Guild, 'iconURL'> & {
  iconURL: string | null
}
export type GetGuildRequest = string | undefined | void

export type GetGuildChannelsResponse = GuildChannel[]
export type GetGuildChannelsRequest = string | undefined | void

export type GetGuildChannelResponse = GuildChannel | undefined
export type GetGuildChannelRequest = {
  id?: string
  guild?: string
}
