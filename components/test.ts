import { ButtonInteraction } from 'discord.js'
import { IComponent } from '../models/component'

export default <IComponent>{
  data: {
    name: 'button',
  },

  cooldown: 30000,

  async execute(interaction: ButtonInteraction) {
    return await interaction.reply({
      content: 'Button work!',
    })
  },
}
