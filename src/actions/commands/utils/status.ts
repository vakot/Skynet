import {
  ChatInputCommandInteraction,
  Events,
  SlashCommandBuilder,
  EmbedBuilder,
} from 'discord.js'

import { nanoid } from 'nanoid'

import { validateInteraction } from '../../../utils/interactions/validate'
import responder from '../../../utils/helpers/responder'

import { Action } from '../../../models/action'

export default {
  id: nanoid(),

  data: new SlashCommandBuilder()
    .setName('status')
    .setDescription('Short information about bot status'),

  event: Events.InteractionCreate,
  cooldown: 10000,

  devsOnly: true,

  async init(interaction: ChatInputCommandInteraction) {
    if (interaction.commandName === this.data.name) {
      const { user, guildId } = interaction

      const invalidations = await validateInteraction(this, user, guildId)

      if (invalidations.size) {
        return await responder.deny.reply(
          interaction,
          invalidations,
          this.data.name
        )
      } else {
        return await this.execute(interaction)
      }
    }
  },

  async execute(interaction: ChatInputCommandInteraction) {
    const { guild, guildId, id } = interaction

    const botsCount = (await guild.fetchIntegrations()).filter(
      (i) => i.application && i.application.bot
    ).size

    const embed = new EmbedBuilder().setFields(
      {
        name: 'Owner',
        value: `<@${guild.ownerId}>`,
        inline: true,
      },
      {
        name: 'Server ID',
        value: `\`${guildId}\``,
        inline: true,
      },
      {
        name: 'Created at',
        value: `<t:${Math.round(guild.createdTimestamp / 1000)}:D>`,
        inline: true,
      },
      {
        name: 'Members',
        value: `User: \`${
          guild.memberCount - botsCount
        }\` | Bot: \`${botsCount}\``,
        inline: true,
      },
      {
        name: 'Event ID',
        value: `\`${id}\``,
        inline: true,
      }
    )

    const reply = await interaction.deferReply({ fetchReply: true })

    return await interaction.editReply({
      content: '',
      embeds: [
        embed.addFields({
          name: 'Execution time',
          value: `Bot: \`${
            Date.now() - reply.createdTimestamp
          }ms\` | Websocket: \`${interaction.client.ws.ping}ms\``,
          inline: true,
        }),
      ],
    })
  },
} as Action
