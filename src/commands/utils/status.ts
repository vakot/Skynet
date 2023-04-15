import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js'
import { ICommand } from '../../models/command'

export default {
  data: new SlashCommandBuilder()
    .setName('status')
    .setDescription('Short information about bot status'),

  cooldown: 60000,

  async execute(interaction: ChatInputCommandInteraction) {
    const executionStart = Date.now()

    const { guild, guildId, id, client } = interaction

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
        value: `Users: \`${guild.memberCount - botsCount}\` | Bots: \`${botsCount}\``,
        inline: true,
      },
      {
        name: 'Event ID',
        value: `\`${id}\``,
        inline: true,
      }
    )

    return await interaction.reply({
      embeds: [
        embed.addFields({
          name: 'Execution time',
          value: `Bot: \`${Date.now() - executionStart}ms\` | Websocket: \`${client.ws.ping}ms\``,
          inline: true,
        }),
      ],
    })
  },
} as ICommand
