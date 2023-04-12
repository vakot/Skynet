import { ButtonInteraction } from 'discord.js'
import { IComponent } from '../models/component'

export default {
  data: {
    name: 'button',
  },

  cooldown: 30000,

  async execute(interaction: ButtonInteraction) {
    return await interaction.reply({
      content: 'Button work!',
    })
  },
} as IComponent
