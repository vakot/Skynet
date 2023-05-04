import { ButtonInteraction } from 'discord.js'

import { QueueRepeatMode, useMasterPlayer } from 'discord-player'

import { ActionEvents } from '@modules/libs/events'
import { Action } from '@modules/models/action'

export default new Action({
  data: { name: 'music-repeat-button' },

  event: ActionEvents.ButtonInteraction,

  async execute(interaction: ButtonInteraction) {
    const { member, guildId, user } = interaction

    if (!member || !guildId) {
      return await interaction.reply({
        content: 'Action can be executed only in server',
        ephemeral: true,
      })
    }

    const player = useMasterPlayer()!

    const queue = player.queues.cache.get(guildId)

    if (!queue) {
      return await interaction.reply({
        content: 'Queue is not exist on this server',
        ephemeral: true,
      })
    }

    if (queue.repeatMode === QueueRepeatMode.TRACK) {
      queue.setRepeatMode(QueueRepeatMode.OFF)
      return await interaction.reply(`Repeat mode switched **Off** by <@${user.id}>`)
    } else if (queue.repeatMode === QueueRepeatMode.QUEUE) {
      queue.setRepeatMode(QueueRepeatMode.TRACK)
      return await interaction.reply(`Repeat mode switched to **Track** by <@${user.id}>`)
    } else {
      queue.setRepeatMode(QueueRepeatMode.QUEUE)
      return await interaction.reply(`Repeat mode switched to **Queue** by <@${user.id}>`)
    }
  },
})
