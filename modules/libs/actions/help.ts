import { IAction } from '@models/action'
import { SkynetEvents } from '@models/event'
import { SkynetClient } from '@modules/SkynetClient'
import { ChatInputCommandInteraction } from 'discord.js'

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
