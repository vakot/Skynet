import { SkynetClient } from '@bot/client'
import { Automation } from '@bot/models/automation'
import { IEvent, SkynetEvents } from '@bot/models/event'
import { Listener } from '@bot/models/listener'
import { interpolate } from '@bot/utils/helpers/interpolate'
import Discord, { GuildChannel } from 'discord.js'

export default {
  type: Discord.Events.InteractionCreate,
  async init(client: SkynetClient, interaction: Discord.ChatInputCommandInteraction) {
    if (!interaction.isChatInputCommand()) {
      return
    }

    const automations = await Automation.find({
      event: SkynetEvents.CommandInteraction,
      guild: interaction.guildId,
    })

    automations
      .filter((automation) => {
        const { conditions } = automation

        return !conditions.find((condition) => {
          if (condition.event !== SkynetEvents.CommandInteraction) {
            return true
          }

          const { value, property } = condition.value

          if ((interaction as any)[property] !== value) {
            return true
          }

          return false
        })
      })
      .map((automation) => {
        const { actions } = automation

        actions.forEach(async (action) => {
          try {
            if (action.event !== SkynetEvents.CommandInteraction) {
              return
            }

            if (action.type === 'reply') {
              const { message, ephemeral } = action.value as {
                message: Discord.MessageCreateOptions
                ephemeral: boolean
              }

              return await interaction.reply({
                content: interpolate(message.content, interaction),
                ephemeral,
              })
            } else if (action.type === 'sendMessage') {
              const { channels, message } = action.value as {
                channels: GuildChannel['id'][]
                message: Discord.MessageCreateOptions
              }

              return channels?.forEach(
                async (channel) =>
                  await interaction.guild?.channels.fetch(channel).then((c) => {
                    if (c?.isTextBased())
                      c.send({
                        content: interpolate(message.content, interaction),
                      })
                  })
              )
            }
          } catch (error) {
            client.logger.error(error)
          }
        })
      })

    const listener = await Listener.findById(interaction.commandId).populate('action')

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

    if (listener.action.event !== SkynetEvents.CommandInteraction) {
      return interaction.reply({
        content: 'The action associated with this listener for this command has wrong event type',
        ephemeral: true,
      })
    }

    try {
      listener.action.toObject().execute(client, interaction)
      client.logger.log(`${listener.action.name || listener.action._id} executed`)
    } catch (error) {
      interaction.reply({
        content: 'The listener for this command failed to be executed',
        ephemeral: true,
      })
      client.logger.error(error)
    }
  },
} as IEvent
