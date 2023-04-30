import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js'

import { Action } from '../../modules/models/action'
import { ActionEvents } from '../../modules/libs/events'
import { ActionCategories } from '../../modules/libs/categories'

export default new Action({
  data: new SlashCommandBuilder()
    .setName('status')
    .setDescription('Short information about bot status'),

  event: ActionEvents.CommandInteraction,

  category: ActionCategories.General,

  devsOnly: true,
  testOnly: true,

  async execute(interaction: ChatInputCommandInteraction) {
    const { guild, guildId, id } = interaction

    if (!guild) return

    const reply = await interaction.deferReply({ ephemeral: true, fetchReply: true })

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
        value: `User: \`${guild.memberCount - botsCount}\` | Bot: \`${botsCount}\``,
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
          value: `Bot: \`${Date.now() - reply.createdTimestamp}ms\` | Websocket: \`${
            interaction.client.ws.ping
          }ms\``,
          inline: true,
        }),
      ],
    })
  },
})
