import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  SlashCommandStringOption,
  GuildMember,
  VoiceChannel,
} from 'discord.js'

import { useMasterPlayer } from 'discord-player'

import { Action } from '@modules/models/action'
import { ActionEvents } from '@modules/libs/events'

import logger from '@utils/helpers/logger'

export default new Action({
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Which song i should play?')
    .addStringOption(
      new SlashCommandStringOption()
        .setName('query')
        .setDescription('URL | name of the song')
        .setRequired(true)
    ),

  event: ActionEvents.CommandInteraction,

  async execute(interaction: ChatInputCommandInteraction) {
    const { member, guild, options } = interaction

    await interaction.deferReply({ ephemeral: true })

    if (!guild) {
      return await interaction.followUp('Command can be executed only in server')
    }

    const query = options.getString('query', true)

    const voiceChannel = (member as GuildMember).voice.channel as VoiceChannel

    const player = useMasterPlayer()!

    const { track } = await player.play(voiceChannel, query, {
      nodeOptions: {
        metadata: interaction,
        leaveOnEmptyCooldown: 60_000,
        leaveOnEndCooldown: 60_000,
      },
    })

    track.requestedBy = interaction.user

    logger.log(`${track.title} enqueued by ${track.requestedBy.tag}`)

    return await interaction.followUp(`**${track.title}** enqueued`)
  },
})
