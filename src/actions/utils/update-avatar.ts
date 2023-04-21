import {
  ChatInputCommandInteraction,
  Events,
  SlashCommandBuilder,
} from 'discord.js'
import fs from 'fs'
import axios from 'axios'

import { Action } from '../../models/action'
import logger from '../../utils/helpers/logger'
import { validateAction } from '../../utils/helpers/validateAction'

export default new Action({
  category: 'Utilities',

  data: new SlashCommandBuilder()
    .setName('update-avatar')
    .setDescription("Update bot's avatar")
    .addAttachmentOption((option) =>
      option
        .setName('image')
        .setDescription('Image to be places as new bot avatar')
        .setRequired(true)
    ),

  event: Events.InteractionCreate,

  devsOnly: true,
  cooldown: 300_000,

  async init(interaction: ChatInputCommandInteraction) {
    if (this.data.name !== interaction.commandName) return

    const invalidation = validateAction(
      this,
      interaction.guild,
      interaction.user
    )

    if (invalidation) {
      return await interaction.reply({
        content: invalidation,
        ephemeral: true,
      })
    }

    return await this.execute(interaction)
  },

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
