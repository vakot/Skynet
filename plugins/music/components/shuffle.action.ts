import { ButtonInteraction } from 'discord.js'

import { useMainPlayer } from 'discord-player'

import { ActionEvents } from '@modules/libs/events'
import { Action } from '@modules/models/action'

import logger from '@utils/helpers/logger'

import { basePrecondition } from '../utils/basePrecondition'

export default new Action({
  data: { name: 'music-shuffle-button' },

  event: ActionEvents.ButtonInteraction,

  cooldown: 12_000,

  async precondition(interaction: ButtonInteraction) {
    if (!(await basePrecondition(interaction))) return false

    if (!useMainPlayer()!.queues.cache.has(interaction.guildId!)) {
      await interaction.reply({
        content: 'Queue does not exist on this server',
        ephemeral: true,
      })
      return false
    }

    return true
  },

  async execute(interaction: ButtonInteraction) {
    const { guildId, user } = interaction

    const queue = useMainPlayer()!.queues.cache.get(guildId!)!

    queue.tracks.shuffle()

    logger.log(`Queue shuffled by ${user.tag}`)

    return await interaction.reply(`Queue shuffled by <@${user.id}>`)
  },
})
