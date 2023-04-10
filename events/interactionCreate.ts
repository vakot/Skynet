import { BaseInteraction, Collection, Events } from 'discord.js'
import { botClient } from '../src'

async function replyWith(message, interaction) {
  return await interaction.reply({
    content: message,
    ephemeral: true,
  })
}

function handleCooldown(component, interaction): Boolean {
  const { cooldowns } = botClient

  // Command in cooldown for specific user
  if (!cooldowns.has(component.data.name)) {
    cooldowns.set(component.data.name, new Collection())
  }

  // Cooldown logic
  if (component.cooldown) {
    const now = Date.now()
    const timestamps = cooldowns.get(component.data.name)

    if (timestamps.has(interaction.user.id)) {
      const expirationTime =
        timestamps.get(interaction.user.id) + component.cooldown

      if (now < expirationTime) {
        replyWith(
          `In cooldown for ${Math.round((expirationTime - now) / 1000)}s`,
          interaction
        )

        return true
      }
    }

    timestamps.set(interaction.user.id, now)
    setTimeout(() => timestamps.delete(interaction.user.id), component.cooldown)
  }

  return false
}

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction: BaseInteraction) {
    const { commands, components } = botClient

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

      // handleCooldown(menu, interaction)

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
