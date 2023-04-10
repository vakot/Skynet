import { AnySelectMenuInteraction } from 'discord.js'
import { IComponent } from '../models/component'

export default <IComponent>{
  data: {
    name: 'select2',
  },

  cooldown: 300,

  async execute(interaction: AnySelectMenuInteraction) {
    return await interaction.reply({
      content: `Select [2] work to! ${interaction.values}`,
    })
  },
}
