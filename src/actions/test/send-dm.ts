import { ButtonInteraction, ClientEvents, Events } from 'discord.js'
import { Action } from '../../models/Action'
import { validateAction } from '../../utils/helpers/validateAction'

export default class ButtonCallback extends Action {
  data = { name: 'test-button-send-dm' }

  event: keyof ClientEvents = Events.InteractionCreate

  devsOnly = true
  testOnly = true
  cooldown = 10_000

  async init(interaction: ButtonInteraction): Promise<any> {
    if (interaction.customId !== this.data.name) return

    const invalidation = validateAction(
      this,
      interaction.guild,
      interaction.user
    )

    if (invalidation) {
      return await interaction.reply({ content: invalidation, ephemeral: true })
    }

    return await this.execute(interaction)
  }

  async execute(interaction: ButtonInteraction): Promise<any> {
    await interaction.user.send('Test DM message')

    return await interaction.reply({
      content: 'DM message is sent',
      ephemeral: true,
    })
  }
}
