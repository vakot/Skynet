import { ChatInputCommandInteraction, Collection, Snowflake } from 'discord.js'

import { SkynetEvents } from '@modules/libs/events'
import { Action, IAction } from '@modules/models/action'
import { SkynetClient } from '@modules/models/client'

import { Guild, IGuild } from '@modules/models/guild'
import { isAction } from '@utils/action'
import { isCommand } from '@utils/command'
import mongoose from 'mongoose'

const createCommandAction: IAction = {
  name: 'command-create',
  event: SkynetEvents.CommandInteraction,
  async execute(client: SkynetClient, interaction: ChatInputCommandInteraction) {
    const messageId: string = interaction.options.get('message', true).value as string
    const actionId: string = interaction.options.get('action', true).value as string
    const guildId: string | null =
      (interaction.options.get('guild')?.value as string) || interaction.guildId

    if (!guildId) {
      return interaction.reply({
        content: 'Commands can only be created in guilds',
        ephemeral: true,
      })
    }

    try {
      const message = await interaction.channel?.messages.fetch(messageId)!

      const regex = /```(.*?)```/gs
      const matches: string[] = []

      let match
      while ((match = regex.exec(message.content)) !== null) {
        matches.push(match[1])
      }

      const command = eval(`(${matches.join('\n')})`)

      if (!isCommand(command)) throw new Error('Not an command')

      const appCommand = (await client.application?.commands.fetch())?.find(
        ({ name }) => command.name === name
      )

      if (appCommand) {
        // TODO: confirm edit button
        // TODO: check permissions (get connected action and check)
      }

      await client.application?.commands.create(command, guildId)

      const guild: IGuild | null = await Guild.findById(guildId)

      if (!guild) {
        new Guild({
          _id: guildId,
          command: new Collection<Snowflake, string>([[command.name, actionId]]),
        }).save()
      } else {
        Guild.updateOne(
          { _id: guild._id },
          { ...guild, command: guild.command.set(command.name, actionId) }
        )
      }

      return interaction.reply({
        content: `Command created and will be availible soon`,
        ephemeral: true,
      })
    } catch (error) {
      return interaction.reply({
        content: `Failed to parse message into command\n\`\`\`${error}\`\`\``,
        ephemeral: true,
      })
    }
  },
}

const createAction: IAction = {
  name: 'action-create',
  event: SkynetEvents.CommandInteraction,
  async execute(client: SkynetClient, interaction: ChatInputCommandInteraction) {
    const messageId: string = interaction.options.get('message', true).value as string

    try {
      const message = await interaction.channel?.messages.fetch(messageId)!

      const regex = /```(.*?)```/gs
      const matches: string[] = []

      let match
      while ((match = regex.exec(message.content)) !== null) {
        matches.push(match[1])
      }

      const action = eval(`(${matches.join('\n')})`)

      if (!isAction(action)) throw new Error('Not an action')

      const _id = new mongoose.Types.ObjectId()

      await new Action({ _id, ...action }).save()

      return interaction.reply({
        content: `Action created with id \`${_id}\``,
        ephemeral: true,
      })
    } catch (error) {
      console.error(error)
      return interaction.reply({
        content: `Failed to parse message into action\n\`\`\`${error}\`\`\``,
        ephemeral: true,
      })
    }
  },
}

export const SkynetActions: IAction[] = [createCommandAction, createAction]
