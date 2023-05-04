import { ButtonInteraction } from 'discord.js'

import { QueueRepeatMode, useMasterPlayer } from 'discord-player'

import { ActionEvents } from '@modules/libs/events'
import { Action } from '@modules/models/action'

import { getEmbed } from '../utils/getEmbed.i'
import { getActionRow } from '../utils/getActionRow.i'

export default new Action({
  data: { name: 'music-repeat-button' },

  event: ActionEvents.ButtonInteraction,

  cooldown:6_000,

  async execute(interaction: ButtonInteraction) {
    const { member, guildId, user, message } = interaction

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
