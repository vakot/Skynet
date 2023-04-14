import {
  ChatInputCommandInteraction,
  Events,
  SlashCommandBuilder,
  EmbedBuilder,
} from 'discord.js'
import { IAction } from '../../models/action'
import { logger } from '../../utils/logger'
import { isInCooldown } from '../../utils/cooldownHandler'

export default {
  data: {
    name: 'status',
    command: new SlashCommandBuilder()
      .setName('status')
      .setDescription('Short information about bot status'),
    cooldown: 3000,
  },

  listener: {
    event: Events.InteractionCreate,
  },

  async init(interaction) {
    if (
      interaction.isChatInputCommand() &&
      interaction.commandName == this.data.name &&
      !isInCooldown(interaction)
    )
      return this.execute(interaction).catch(logger.error)
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
        value: `User's: \`${
          guild.memberCount - botsCount
        }\` | Bot's: \`${botsCount}\``,
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
          value: `\`${Date.now() - executionStart}ms\``,
          inline: true,
        }),
      ],
    })
  },
} as IAction
