import { SkynetEvents } from '@modules/libs/events'
import { IAction } from '@modules/models/action'
import { SkynetClient } from '@modules/models/client'
import { ChatInputCommandInteraction } from 'discord.js'

export const action: IAction = {
  name: 'status',
  event: SkynetEvents.CommandInteraction,
  execute: async (client: SkynetClient, interaction: ChatInputCommandInteraction) => {
    interaction.reply({
      content: 'status',
      ephemeral: true,
    })
  },
}
