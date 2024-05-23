import { SkynetClient } from '@bot/client'
import { IEvent, SkynetEvents } from '@bot/models/event'
import { Listener } from '@bot/models/listener'
import Discord from 'discord.js'

export default {
  type: Discord.Events.InteractionCreate,
  async init(client: SkynetClient, interaction: Discord.ButtonInteraction) {
    if (!interaction.isButton()) {
      return
    }

    const listener = await Listener.findById(interaction.customId).populate('action')

    if (!listener) {
      return interaction.reply({
        content: 'No listeners for this button provided',
        ephemeral: true,
      })
    }

    if (listener.event !== SkynetEvents.ButtonInteraction) {
      return interaction.reply({
        content: 'The listener for this button has wrong event type',
        ephemeral: true,
      })
    }

    if (!listener.action) {
      return interaction.reply({
        content: "The listener for this button can't be executed",
        ephemeral: true,
      })
    }

    if (listener.action.event !== SkynetEvents.ButtonInteraction) {
      return interaction.reply({
        content: 'The action associated with this listener for this button has wrong event type',
        ephemeral: true,
      })
    }

    try {
      listener.action.toObject().execute(client, interaction)
      client.logger.log(`${listener.action.name || listener.action._id} executed`)
    } catch (error) {
      interaction.reply({
        content: 'The listener for this button failed to be executed',
        ephemeral: true,
      })
      client.logger.error(error)
    }
  },
} as IEvent
