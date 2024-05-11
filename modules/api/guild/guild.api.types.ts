import { BaseGuild } from 'discord.js'

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

export type GetGuildResponse = Omit<BaseGuild, 'iconURL'> & {
  iconURL: string | null
}
export type GetGuildRequest = string | undefined | void
