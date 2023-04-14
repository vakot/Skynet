import { ClientEvents, PermissionFlags, SlashCommandBuilder } from 'discord.js'

export interface IAction {
  data: {
    name: string
    category?: string
    command?: SlashCommandBuilder
    cooldown?: number
    permissions?: PermissionFlags[]
  }
  listener: {
    event: keyof ClientEvents
    once?: boolean
  }
  init(...args: any): any
  execute(...args: any): any
}
