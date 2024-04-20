import { SlashCommandBuilder } from 'discord.js'

export default new SlashCommandBuilder()
  .setName('action-create')
  .setDescription('Create an action from ```code``` in message')
  .addStringOption((option) =>
    option.setName('message').setDescription('@id of ```code``` message').setRequired(true)
  )
  .toJSON()
