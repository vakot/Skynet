import { BaseInteraction, Events } from 'discord.js'
import { skynet } from '../src'

import { handleCooldown } from '../utils/cooldownHandler'
import { IEvent } from '../models/event'
import { logger } from '../utils/logger'

export default {
  name: Events.InteractionCreate,
  async execute(interaction: BaseInteraction) {
    const { commands, components } = skynet

    // Bruh...
    if (interaction.isChatInputCommand()) {
      // Command is not exist
      if (!commands.slesh.has(interaction.commandName)) {
        return await interaction.reply({
          content: `Command \`/${interaction.commandName}\` not found`,
          ephemeral: true,
        })
      }

      const command = commands.slesh.get(interaction.commandName)

      if (!command) return

      if (handleCooldown(command, interaction)) return

      return await command.execute(interaction).catch(logger.error)
    }

    // Bruh...
    if (interaction.isButton()) {
      // Button is not exist
      if (!components.has(interaction.customId)) {
        return await interaction.reply({
          content: `Button \`id:${interaction.customId}\` not found`,
          ephemeral: true,
        })
      }

      const button = components.get(interaction.customId)

      if (!button) return

      if (handleCooldown(button, interaction)) return

      return await button.execute(interaction).catch(logger.error)
    }

    // Bruh...
    if (interaction.isAnySelectMenu()) {
      // Menu is not exist
      if (!components.has(interaction.customId)) {
        return await interaction.reply({
          content: `Menu \`id:${interaction.customId}\` not found`,
          ephemeral: true,
        })
      }

      const menu = components.get(interaction.customId)

      if (!menu) return

      if (handleCooldown(menu, interaction)) return

      return await menu.execute(interaction).catch(logger.error)
    }
  },
} as IEvent
