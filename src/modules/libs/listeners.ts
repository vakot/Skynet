import { Action, IAction } from '@modules/models/action'
import { SkynetClient } from '@modules/models/client'
import { IEvent } from '@modules/models/event'
import { Guild, IGuild } from '@modules/models/guild'
import { Color } from '@utils/logger'
import { ChatInputCommandInteraction, Events, Message } from 'discord.js'

export const SkynetEventListeners: Array<IEvent> = [
  {
    type: Events.ClientReady,
    once: true,
    async init(client, ...args) {
      const username = client.logger.color(client.user?.displayName, { foreground: Color.Red })
      client.logger.info(`Welcome to ${username}`)
    },
  },
  {
    type: Events.MessageCreate,
    async init(client: SkynetClient, message: Message) {
      if (message.author.id === client.user?.id) {
        return
      }
    },
  },
  {
    type: Events.InteractionCreate,
    async init(client: SkynetClient, interaction: ChatInputCommandInteraction) {
      if (!interaction.isChatInputCommand()) {
        return
      }

      const globalCommand = client.globalCommands.find(
        ({ name }) => interaction.commandName === name
      )

      if (globalCommand) {
        const action = client.globalActions.find(({ name }) => globalCommand.name === name)

        if (!action) {
          return interaction.reply({
            content: 'Unknown action! X_X',
            ephemeral: true,
          })
        }

        try {
          action.history?.push({
            userId: interaction.user.id,
            timestamp: new Date(),
          })
          return action.execute(client, interaction)
        } catch (error) {
          return console.error(error)
        }
      }

      const guildCommand = (await interaction.guild?.commands.fetch())?.find(
        ({ name }) => interaction.commandName === name
      )

      if (guildCommand) {
        const guild: IGuild | null = await Guild.findById(interaction.guildId)

        if (!guild) {
          return interaction.reply({
            content: 'Unknown guild! X_X',
            ephemeral: true,
          })
        }

        const action: IAction | null = (
          await Action.findById(guild?.command.get(interaction.commandName))
        ).toObject()

        if (!action) {
          return interaction.reply({
            content: 'Unknown action! X_X',
            ephemeral: true,
          })
        }

        try {
          action.history?.push({
            userId: interaction.user.id,
            timestamp: new Date(),
          })
          if ('_id' in action) {
            Action.updateOne({ _id: action._id }, action)
          }
          return action.execute(client, interaction)
        } catch (error) {
          return console.error(error)
        }
      }

      return interaction.reply({
        content: 'Unknown command! X_X',
        ephemeral: true,
      })
    },
  },
]
