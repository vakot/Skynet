import { ApplicationCommand, ApplicationCommandData } from 'discord.js'

export type GetCommandsRequest = {
  ids?: string[] | string
  guild?: string
} | void
export type GetCommandsResponse = ApplicationCommand[] | undefined

export type GetCommandRequest = string | undefined | void

export type GetCommandResponse = ApplicationCommand

export type PostCommandRequest = { guild?: string } & ApplicationCommandData
export type PostCommandResponse = ApplicationCommand

export type PatchCommandRequest = {
  id: string
  guild?: string
} & ApplicationCommandData
export type PatchCommandResponse = ApplicationCommand
