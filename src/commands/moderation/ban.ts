import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'
import { ICommand } from '../../models/command'

export default {
  data: new SlashCommandBuilder().setName('ban').setDescription('Ban a user on server'),

  cooldown: 6000,

  async execute(interaction: ChatInputCommandInteraction) {
    interaction.reply({ content: `Bang!`, ephemeral: true })
  },
} as ICommand
