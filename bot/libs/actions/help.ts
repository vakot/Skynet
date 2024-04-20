import { ChatInputCommandInteraction } from 'discord.js'

import { SkynetClient } from '@bot/client'
import { IAction } from '@bot/models/action'
import { SkynetEvents } from '@bot/models/event'

export default {
  name: 'help',
  event: SkynetEvents.CommandInteraction,
  execute: async (client: SkynetClient, interaction: ChatInputCommandInteraction) => {
    interaction.reply({
      content: 'help placeholder',
      ephemeral: true,
    })
  },
} as IAction
