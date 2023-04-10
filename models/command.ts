import { SlashCommandBuilder } from 'discord.js'

export interface ISleshCommand {
  data: SlashCommandBuilder
  execute(...args: any): any
  cooldown?: number
}

export interface IMessageCommand {
  data: {
    name: string
  }
  execute(...args: any): any
  cooldown?: number
}
