import { ChatInputCommandInteraction } from 'discord.js'

import { SkynetClient } from '@bot/client'
import { IAction } from '@bot/models/action'
import { SkynetEvents } from '@bot/models/event'

export default {
  name: 'status',
  event: SkynetEvents.CommandInteraction,
  execute: async (client: SkynetClient, interaction: ChatInputCommandInteraction) => {
    interaction.reply({
      content: 'status placeholder',
      ephemeral: true,
    })
  },
} as IAction
