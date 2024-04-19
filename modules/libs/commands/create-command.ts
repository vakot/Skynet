import { SlashCommandBuilder } from 'discord.js'

export default new SlashCommandBuilder()
  .setName('command-create')
  .setDescription('Create an command from ```code``` in message')
  .addStringOption((option) =>
    option.setName('message').setDescription('Message id').setRequired(true)
  )
  .addStringOption((option) =>
    option.setName('action').setDescription('Action id').setRequired(true)
  )
  .addStringOption((option) =>
    option.setName('guild').setDescription('Guild id').setRequired(false)
  )
  .toJSON()
