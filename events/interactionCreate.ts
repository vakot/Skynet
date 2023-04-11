import { BaseInteraction, Events } from 'discord.js'
import { skynet } from '../src'

import { handleCooldown } from '../utils/cooldownHandler'

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction: BaseInteraction) {
    const { commands, components } = skynet

    // Bruh...
    if (interaction.isChatInputCommand()) {
      // Command is not exist
      if (!commands.has(interaction.commandName)) {
        return await interaction.reply({
          content: `Command \`/${interaction.commandName}\` not found`,
          ephemeral: true,
        })
      }

      const command = commands.get(interaction.commandName)

      if (!command) return

      if (handleCooldown(command, interaction)) return

      try {
        await command.execute(interaction)
      } catch (error) {
        await interaction.reply({
          content: `Error occured while /${command.data.name} executing`,
          ephemeral: true,
        })
        console.error(error)
      }
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

      try {
        await button.execute(interaction)
      } catch (error) {
        await interaction.reply({
          content: `Error occured while ${button.data.name} executing`,
          ephemeral: true,
        })
        console.error(error)
      }
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

      try {
        await menu.execute(interaction)
      } catch (error) {
        await interaction.reply({
          content: `Error occured while ${menu.data.name} executing`,
          ephemeral: true,
        })
        console.error(error)
      }
    }
  },
}
