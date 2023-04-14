import { PermissionFlags, SlashCommandBuilder } from 'discord.js'
import { IListener } from './listener'

export interface IAction {
  data: {
    name: string
    category?: string
    command?: SlashCommandBuilder
    cooldown?: number
    permissions?: PermissionFlags[]
  }
  listener: IListener
  init(...args: any): any
  execute(...args: any): any
}
