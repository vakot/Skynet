import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  Events,
  ClientEvents,
} from 'discord.js'

import { Action } from '../../models/Action'

export default class PingCommand extends Action {
  data = new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with "Pong!"')

  event: keyof ClientEvents = Events.InteractionCreate

  async init(interaction: ChatInputCommandInteraction): Promise<any> {
    if (interaction.commandName !== this.data.name) return

    return await this.execute(interaction)
  }

  async execute(interaction: ChatInputCommandInteraction) {
    return await interaction.reply({
      content: `:ping_pong: Pong!`,
      ephemeral: true,
    })
  }
}
