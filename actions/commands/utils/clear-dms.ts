import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from 'discord.js'

import { Action } from '@modules/models/action'
import { ActionEvents } from '@modules/libs/events'
import { ActionCategories } from '@modules/libs/categories'

export default new Action({
  data: new SlashCommandBuilder()
    .setName('clear-dms')
    .setDescription('Delete all bot messages in your DMs'),

  event: ActionEvents.CommandInteraction,

  category: ActionCategories.Utils,

  async execute(interaction: ChatInputCommandInteraction) {
    const acceptButton = new ButtonBuilder()
      .setCustomId('accept-clear-dms')
      .setLabel('Do it!')
      .setStyle(ButtonStyle.Success)
    const denyButton = new ButtonBuilder()
      .setCustomId('cancel-clear-dms')
      .setLabel('No! Stop!')
      .setStyle(ButtonStyle.Danger)

    const row = new ActionRowBuilder<ButtonBuilder>().setComponents(acceptButton, denyButton)

    const response = await interaction.reply({
      content: `Are you sure you want to clear your DMs?\n⤷ Auto-cancelling <t:${
        Math.round(Date.now() * 0.001) + 60
      }:R>`,
      components: [row],
      ephemeral: true,
      fetchReply: true,
    })

    try {
      const confirmation = await response.awaitMessageComponent({
        time: 60_000,
      })

      if (confirmation.customId === 'accept-clear-dms') {
        const { user } = interaction

        const channel = await user.createDM()

        const messages = await channel.messages.fetch()

        messages.forEach(async (message) => {
          if (message.author.id === interaction.client.user.id) {
            await message.delete()
          }
        })

        return await confirmation.update({
          content: `Congratulation! You DMs is clear now ^_^\n${messages.size} messages deleted`,
          components: [],
        })
      } else if (confirmation.customId === 'cancel-clear-dms') {
        await confirmation.update({
          content: 'Action cancelled\n⤷ Message will be deleted in `10s`',
          components: [],
        })
        return await setTimeout(() => confirmation.deleteReply(), 10_000)
      }
    } catch (e) {
      await interaction.editReply({
        content:
          'Confirmation not received within 1 minute, cancelling\n⤷ Message will be deleted in `10s`',
        components: [],
      })
      return await setTimeout(() => interaction.deleteReply(), 10_000)
    }
  },
})
