import { ChatInputCommandInteraction, Events } from 'discord.js'

import { SkynetClient } from '@bot/client'
import { IEvent } from '@bot/models/event'
import { Guild, IGuild } from '@bot/models/guild'

export default {
  type: Events.InteractionCreate,
  async init(client: SkynetClient, interaction: ChatInputCommandInteraction) {
    if (!interaction.isChatInputCommand()) {
      return
    }

    const globalCommand = client.globalCommands.find(({ name }) => interaction.commandName === name)

    if (globalCommand) {
      const action = client.globalActions.find(({ name }) => globalCommand.name === name)

      if (!action) {
        return interaction.reply({
          content: 'Unknown action! X_X',
          ephemeral: true,
        })
      }

      try {
        // action.history?.push({
        //   userId: interaction.user.id,
        //   timestamp: new Date(),
        // })
        return action.execute(client, interaction)
      } catch (error) {
        return client.logger.error(error)
      }
    }

    const guild: IGuild | null = await Guild.findById(interaction.guildId)

    if (!guild) {
      return interaction.reply({
        content: 'Unknown guild! X_X',
        ephemeral: true,
      })
    }

    console.log(guild)

    // const action: IAction = (
    //   await Action.findById(guild?.[SkynetEvents.CommandInteraction].get(interaction.commandName))
    // )?.toObject()

    // if (!action) {
    //   return interaction.reply({
    //     content: 'Unknown action! X_X',
    //     ephemeral: true,
    //   })
    // }

    // try {
    //   action.history?.push({
    //     userId: interaction.user.id,
    //     timestamp: new Date(),
    //   })
    //   if ('_id' in action) {
    //     Action.updateOne({ _id: action._id }, action)
    //   }
    //   return action.execute(client, interaction)
    // } catch (error) {
    //   return client.logger.error(error)
    // }
  },
} as IEvent