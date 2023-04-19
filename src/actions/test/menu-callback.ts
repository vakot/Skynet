import { ClientEvents, Events, StringSelectMenuInteraction } from 'discord.js'
import { Action } from '../../models/Action'
import { validateAction } from '../../utils/helpers/validateAction'

export default class TestMenuCallback extends Action {
  data = { name: 'test-menu' }

  event: keyof ClientEvents = Events.InteractionCreate

  devsOnly = true
  testOnly = true

  async init(interaction: StringSelectMenuInteraction): Promise<any> {
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

  async execute(interaction: StringSelectMenuInteraction): Promise<any> {
    return await interaction.reply({
      content: 'Selected values: ' + interaction.values.sort().join(' | '),
      ephemeral: true,
    })
  }
}
