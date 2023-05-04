import {
  ChatInputCommandInteraction,
  GuildMember,
  SlashCommandBuilder,
  VoiceChannel,
} from 'discord.js'

import { joinVoiceChannel } from '@discordjs/voice'

import { Action } from '@modules/models/action'
import { ActionEvents } from '@modules/libs/events'

import logger from '@utils/helpers/logger'

export default new Action({
  data: new SlashCommandBuilder()
    .setName('join')
    .setDescription('Makes bot join to your voice channel'),

  event: ActionEvents.CommandInteraction,

  async execute(interaction: ChatInputCommandInteraction) {
    const { member } = interaction

    await interaction.deferReply({ ephemeral: true })

    if (!member) {
      return await interaction.followUp('Command can be executed only in server')
    }

    const voiceChannel = (member as GuildMember).voice.channel as VoiceChannel

    if (!voiceChannel) {
      return await interaction.followUp('You need to be in voice channel')
    }

    const connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: interaction.guildId!,
      adapterCreator: interaction.guild?.voiceAdapterCreator!,
    })

    connection.on('error', (error) => {
      logger.error('Loose voice connection')
      logger.error(error)
    })

    return await interaction.followUp(`Joining to <#${voiceChannel.id}>...`)
  },
})
