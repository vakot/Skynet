import { AnySelectMenuInteraction, ButtonInteraction } from 'discord.js'
import { devs, testServer } from '../../config.json'
import logger from '../utils/logger'
import store from '../utils/store'
import { isInteractionCooldown } from '../utils/cooldownHandler'
import { IComponent } from '../models/component'

export default async function (
  interaction: AnySelectMenuInteraction | ButtonInteraction
) {
  const components = store.get('components')

  try {
    const component: IComponent = await components.find(
      (cmd) => cmd.data.customId === interaction.customId
    )

    if (!component) throw `Component ${interaction.customId} isn't exist`

    if (component.testOnly && interaction.guildId !== testServer) {
      return await interaction.reply({
        content: 'This component availible only on test server',
        ephemeral: true,
      })
    }

    if (component.devsOnly && !devs.includes(interaction.member.user.id)) {
      return await interaction.reply({
        content: 'This component availible only for developers',
        ephemeral: true,
      })
    }

    if (isInteractionCooldown(interaction)) return

    component.callback(interaction)
  } catch (error) {
    logger.error(error)
  }
}
