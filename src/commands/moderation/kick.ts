import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'
import { ICommand } from '../../models/command'

export default {
  data: new SlashCommandBuilder().setName('kick').setDescription('Kick auser from server'),

  cooldown: 6000,

  async execute(interaction: ChatInputCommandInteraction) {
    interaction.reply({ content: `Knock!`, ephemeral: true })
  },
} as ICommand
