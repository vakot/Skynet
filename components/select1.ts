import { AnySelectMenuInteraction } from 'discord.js'
import { IComponent } from '../models/component'

export default {
  data: {
    name: 'select1',
  },

  cooldown: 300,

  async execute(interaction: AnySelectMenuInteraction) {
    return await interaction.reply({
      content: `Select [1] work! ${interaction.values}`,
    })
  },
} as IComponent
