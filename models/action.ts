import { PermissionFlags, SlashCommandBuilder } from 'discord.js'
export interface IAction {
  data: {
    name: string
    command?: SlashCommandBuilder
    cooldown?: number
    permissions?: PermissionFlags[]
  }
  init(...args: any): any
  execute(...args: any): any
}
