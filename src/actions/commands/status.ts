import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  Events,
  SlashCommandBuilder,
} from 'discord.js'

import { Action } from '../../models/action'

import { validateAction } from '../../utils/helpers/validateAction'

export default new Action({
  category: 'About',

  data: new SlashCommandBuilder()
    .setName('status')
    .setDescription('Short information about bot status'),

  event: Events.InteractionCreate,

  devsOnly: true,

  async execute(interaction: ChatInputCommandInteraction) {
    if (this.data.name !== interaction.commandName) return

    const invalidation = validateAction(
      this,
      interaction.guild,
      interaction.user
    )

    if (invalidation) {
      return await interaction.reply({
        content: invalidation,
        ephemeral: true,
      })
    }

    const { guild, guildId, id } = interaction

    if (!guild) return

    const reply = await interaction.deferReply({ fetchReply: true })

    const botsCount = (await guild.fetchIntegrations()).filter(
      (i) => i.application && i.application.bot
    ).size

    const embed = new EmbedBuilder().setFields(
      {
        name: 'Server owner',
        value: `<@${guild.ownerId}>`,
        inline: true,
      },
      {
        name: 'Server ID',
        value: `||\`${guildId}\`||`,
        inline: true,
      },
      {
        name: 'Created at',
        value: `<t:${Math.round(guild.createdTimestamp / 1000)}:f>`,
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
        value: `||\`${id}\`||`,
        inline: true,
      }
    )

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
})
