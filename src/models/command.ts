import { SlashCommandBuilder } from 'discord.js'

export interface ICommand {
  data: SlashCommandBuilder
  delete?: boolean
  cooldown?: number
  testOnly?: boolean
  devsOnly?: boolean
  forceUpdate?: boolean
  execute(...args: any): any
}
