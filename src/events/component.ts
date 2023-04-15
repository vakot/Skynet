import { AnySelectMenuInteraction, ButtonInteraction, Events } from 'discord.js'

import logger from '../utils/helpers/logger'
import isCooldown from '../utils/conditions/isCooldown'
import store from '../utils/helpers/store'

import { IEvent } from '../models/event'

import { devs, testServer } from '../../config.json'
import { IComponent } from '../models/component'

export default {
  name: Events.InteractionCreate,

  async execute(interaction: ButtonInteraction | AnySelectMenuInteraction) {
    if (!interaction.isAnySelectMenu() && !interaction.isButton()) return

    const { customId } = interaction

    logger.info(`Component ${customId} execution called by ${interaction.user.tag}`)

    try {
      const components = store.get('components')

      const component: IComponent = await components.find(
        (cmp) => cmp.data.data.custom_id === customId
      )

      if (!component) throw `Component ${customId} isn't exist`

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

      if (isCooldown(customId, component.cooldown, interaction)) return

      component.callback(interaction)
    } catch (error) {
      logger.error(error)
    }
  },
} as IEvent
