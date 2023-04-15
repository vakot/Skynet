import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'
import { ICommand } from '../../models/command'

export default {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with "Pong!"'),

  cooldown: 3000,

  async callback(interaction: ChatInputCommandInteraction) {
    interaction.reply(`:ping_pong: Pong!`)
  },
} as ICommand
