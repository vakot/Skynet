import {
  ChatInputCommandInteraction,
  Events,
  SlashCommandBuilder,
  EmbedBuilder,
} from 'discord.js'

import { nanoid } from 'nanoid'

import { validateInteraction } from '../../utils/helpers/validateInteraction'
import responder from '../../utils/helpers/responder'

import { Action } from '../../models/action'

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

      if (invalidations.length) {
        return await responder.deny.reply(interaction, invalidations)
      } else {
        return await this.execute(interaction)
      }
    }
  },

  async execute(interaction: ChatInputCommandInteraction) {
    const executionStart = Date.now()

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

    const wsPing = interaction.client.ws.ping
    const botPing = Date.now() - executionStart

    return await interaction.reply({
      embeds: [
        embed.addFields({
          name: 'Execution time',
          value: `Bot: \`${botPing}ms\` | Websocket: \`${wsPing}ms\``,
          inline: true,
        }),
      ],
    })
  },
} as Action
