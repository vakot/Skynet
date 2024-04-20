import { ChatInputCommandInteraction, Collection, Snowflake } from 'discord.js'

import { SkynetClient } from '@bot/client'
import { IAction } from '@bot/models/action'
import { SkynetEvents } from '@bot/models/event'
import { Guild, IGuild } from '@bot/models/guild'
import { isCommand } from '@bot/utils/command'

export default {
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

      if (!command || !isCommand(command)) {
        throw new Error('Not an command')
      }

      const appCommand = (await client.application?.commands.fetch())?.find(
        ({ name }) => command.name === name
      )

      if (appCommand) {
        return interaction.reply({
          content: [
            '```typescript',
            '// TODO: confirm edit button',
            '// TODO: check permissions from connected action',
            '```',
          ].join('\n'),
          ephemeral: true,
        })
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
          { ...guild, command: guild.commands.set(command.name, actionId) }
        )
      }

      return interaction
        .reply({
          content: `Command created and will be availible soon`,
          ephemeral: true,
        })
        .then(() =>
          client.logger.info('New command created with:', {
            command: command.name,
            action: actionId,
            guild: guildId,
          })
        )
    } catch (error) {
      return interaction
        .reply({
          content: `Failed to parse message into command\n\`\`\`${error}\`\`\``,
          ephemeral: true,
        })
        .then(() => client.logger.error(error))
    }
  },
} as IAction
