import {
  ChatInputCommandInteraction,
  Collection,
  Events,
  SlashCommandBuilder,
  Snowflake,
} from 'discord.js'

import { Action } from '../../models/action'
import { Ticket } from './models/ticket'

export const tickets = new Collection<Snowflake, Ticket>()

export default new Action({
  data: new SlashCommandBuilder()
    .setName('create-ticket-tool')
    .setDescription('Base setup for ticket tool'),

  event: Events.InteractionCreate,

  async init(interaction: ChatInputCommandInteraction) {
    if (this.data.name !== interaction.commandName) return

    return await this.execute(interaction)
  },

  async execute(interaction: ChatInputCommandInteraction) {
    return await interaction.reply({
      content: 'ticket_tool_base_message',
    })
  },
})
