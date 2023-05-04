import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  SlashCommandStringOption,
  GuildMember,
  VoiceChannel,
} from 'discord.js'

import { QueryType, useMasterPlayer } from 'discord-player'

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

  cooldown: 12_000,

  async execute(interaction: ChatInputCommandInteraction) {
    const { member, guild, options } = interaction

    await interaction.deferReply({ ephemeral: true })

    if (!guild) {
      return await interaction.followUp('Command can be executed only in server')
    }

    const query = options.getString('query', true)

    const voiceChannel = (member as GuildMember).voice.channel as VoiceChannel

    const player = useMasterPlayer()!

    const searchResult = await player.search(query, {
      requestedBy: interaction.user,
      searchEngine: QueryType.AUTO,
    })

    if (!searchResult || !searchResult.tracks.length) {
      return interaction.fetchReply('No results were found!')
    }

    const { track } = await player.play(voiceChannel, searchResult, {
      nodeOptions: {
        metadata: interaction,
        leaveOnEmptyCooldown: 60_000,
        leaveOnEndCooldown: 60_000,
      },
    })

    logger.log(`${track.title} enqueued by ${track.requestedBy?.tag}`)

    return await interaction.followUp(`**${track.title}** enqueued`)
  },
})
