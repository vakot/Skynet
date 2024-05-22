import { SkynetClient } from '@bot/client'
import { Action } from '@bot/models/action'
import { IEvent, SkynetEvents } from '@bot/models/event'
import Discord from 'discord.js'

export default {
  type: Discord.Events.InteractionCreate,
  async init(client: SkynetClient, interaction: Discord.ButtonInteraction) {
    if (!interaction.isButton()) {
      return
    }

    const action = await Action.findById(interaction.customId)

    if (!action) {
      return interaction.reply({
        content: 'No listeners for this button provided',
        ephemeral: true,
      })
    }

    if (action.event !== SkynetEvents.ButtonInteraction) {
      return interaction.reply({
        content: 'The listener for this button has wrong event type',
        ephemeral: true,
      })
    }

    try {
      action.toObject().execute(client, interaction)
      client.logger.log(`${action.name || action._id} executed`)
    } catch (error) {
      interaction.reply({
        content: 'The listener for this button failed to be executed',
        ephemeral: true,
      })
      client.logger.error(error)
    }
  },
} as IEvent
