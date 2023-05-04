import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
} from 'discord.js'

import { QueueRepeatMode, useMasterPlayer } from 'discord-player'

import { Action } from '@modules/models/action'
import { ActionEvents } from '@modules/libs/events'

export default new Action({
  data: new SlashCommandBuilder()
    .setName('repeat')
    .setDescription('Toggle repeat mode')
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName('track')
        .setDescription('Toggle repeat of curren track')
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName('queue')
        .setDescription('Toggle repeat of curren queue')
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder().setName('off').setDescription('Turn repeat mode off')
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName('autoplay')
        .setDescription('Toggle repeat mode to autoplay')
    ),

  event: ActionEvents.CommandInteraction,

  cooldown: 6_000,

  async execute(interaction: ChatInputCommandInteraction) {
    const { member, guildId, options } = interaction

    await interaction.deferReply()

    if (!member || !guildId) {
      return await interaction.followUp({
        content: 'Command can be executed only in server',
        ephemeral: true,
      })
    }

    const player = useMasterPlayer()!

    const queue = player.queues.cache.get(guildId)

    if (!queue) {
      return await interaction.followUp({
        content: 'Queue is not exist on this server',
        ephemeral: true,
      })
    }

    if (options.getSubcommand() === 'track') {
      queue.setRepeatMode(QueueRepeatMode.TRACK)
      return await interaction.followUp(`Repeat mode switched to **Track**`)
    } else if (options.getSubcommand() === 'queue') {
      queue.setRepeatMode(QueueRepeatMode.QUEUE)
      return await interaction.followUp(`Repeat mode switched to **Queue**`)
    } else if (options.getSubcommand() === 'off') {
      queue.setRepeatMode(QueueRepeatMode.OFF)
      return await interaction.followUp(`Repeat mode switched **Off**`)
    } else if (options.getSubcommand() === 'autoplay') {
      queue.setRepeatMode(QueueRepeatMode.AUTOPLAY)
      return await interaction.followUp(`Repeat mode switched to **AutoPlay**`)
    } else {
      return await interaction.followUp('Unknown subcommand')
    }
  },
})
