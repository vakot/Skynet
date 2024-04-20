import { ChatInputCommandInteraction } from 'discord.js'
import mongoose from 'mongoose'

import { SkynetClient } from '@bot/client'
import { Action, IAction } from '@bot/models/action'
import { SkynetEvents } from '@bot/models/event'
import { isAction } from '@bot/utils/action'

export default {
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

      if (!action || !isAction(action)) {
        throw new Error('Not an action')
      }

      const _id = new mongoose.Types.ObjectId()

      await new Action({ _id, ...action }).save()

      return interaction
        .reply({
          content: `Action created with id \`${_id}\``,
          ephemeral: true,
        })
        .then(() => client.logger.info('New action created with id:', _id))
    } catch (error) {
      return interaction
        .reply({
          content: `Failed to parse message into action\n\`\`\`${error}\`\`\``,
          ephemeral: true,
        })
        .then(() => client.logger.error(error))
    }
  },
} as IAction
