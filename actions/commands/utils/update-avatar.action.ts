import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'

import axios from 'axios'
import fs from 'fs'

import { Action } from '@modules/models/action'
import { ActionEvents } from '@modules/libs/events'
import { ActionCategories } from '@modules/libs/categories'

import logger from '@utils/helpers/logger'

export default new Action({
  data: new SlashCommandBuilder()
    .setName('update-avatar')
    .setDescription("Update bot's avatar")
    .addAttachmentOption((option) =>
      option
        .setName('image')
        .setDescription('Image to be places as new bot avatar')
        .setRequired(true)
    ),

  event: ActionEvents.CommandInteraction,

  category: ActionCategories.Utils,

  devsOnly: true,
  testOnly: true,

  async execute(interaction: ChatInputCommandInteraction) {
    const image = interaction.options.getAttachment('image')

    if (!image) {
      return await interaction.reply({
        content: 'No image provided',
        ephemeral: true,
      })
    }

    const response = await axios.get(image.url, {
      responseType: 'arraybuffer',
    })

    const file = `${Date.now()}_${image.name}`

    await fs.writeFileSync(file, Buffer.from(response.data, 'binary'))

    try {
      await interaction.client.user.setAvatar(file)

      await fs.unlinkSync(file)

      logger.debug(`Avatar updated by ${interaction.user.tag}`)

      return await interaction.reply({
        content: `Avatar updated!`,
        ephemeral: true,
      })
    } catch (error) {
      logger.error(error)

      return await interaction.reply({
        content: `Attached file can't be used as avatar!`,
        ephemeral: true,
      })
    }
  },
})
