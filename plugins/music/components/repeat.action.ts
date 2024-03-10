import { ButtonInteraction } from 'discord.js'

import { QueueRepeatMode, useMainPlayer } from 'discord-player'

import { ActionEvents } from '@modules/libs/events'
import { Action } from '@modules/models/action'

import { basePrecondition } from '../utils/basePrecondition'
import { getActionRow } from '../utils/getActionRow'
import { getEmbed } from '../utils/getEmbed'

export default new Action({
  data: { name: 'music-repeat-button' },

  event: ActionEvents.ButtonInteraction,

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
    const { guildId, user, message } = interaction

    const queue = useMainPlayer()!.queues.cache.get(guildId!)!

    if (queue.repeatMode === QueueRepeatMode.TRACK) {
      queue.setRepeatMode(QueueRepeatMode.OFF)
      await interaction.reply(`Repeat mode switched **Off** by <@${user.id}>`)
    } else if (queue.repeatMode === QueueRepeatMode.QUEUE) {
      queue.setRepeatMode(QueueRepeatMode.TRACK)
      await interaction.reply(`Repeat mode switched to **Track** by <@${user.id}>`)
    } else {
      queue.setRepeatMode(QueueRepeatMode.QUEUE)
      await interaction.reply(`Repeat mode switched to **Queue** by <@${user.id}>`)
    }

    return await message.edit({
      embeds: [await getEmbed(queue)],
      components: [await getActionRow(queue)],
    })
  },
})
