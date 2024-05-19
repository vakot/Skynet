import { SkynetClient } from '@bot/client'
import { IEvent, SkynetEvents } from '@bot/models/event'
import { Listener } from '@bot/models/listener'
import { ChatInputCommandInteraction, Events } from 'discord.js'

export default {
  type: Events.InteractionCreate,
  async init(client: SkynetClient, interaction: ChatInputCommandInteraction) {
    if (!interaction.isChatInputCommand()) {
      return
    }

    const { commandId } = interaction

    const listener = await Listener.findOne({
      component: commandId,
    }).populate('action')

    if (!listener) {
      return interaction.reply({
        content: 'No listeners for this command provided',
        ephemeral: true,
      })
    }

    if (listener.event !== SkynetEvents.CommandInteraction) {
      return interaction.reply({
        content: 'The listener for this command has wrong event type',
        ephemeral: true,
      })
    }

    if (listener.guild !== interaction.commandGuildId) {
      return interaction.reply({
        content: 'The listener for this command is not for this server',
        ephemeral: true,
      })
    }

    if (!listener.action) {
      return interaction.reply({
        content: "The listener for this command can't be executed",
        ephemeral: true,
      })
    }

    try {
      return listener.action.toObject().execute(client, interaction)
    } catch (error) {
      interaction.reply({
        content: 'The listener for this command failed to be executed',
        ephemeral: true,
      })
      return client.logger.error(error)
    }
  },
} as IEvent
