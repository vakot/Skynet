import { Interaction } from 'discord.js'

import { getCooldown } from '../fetch/getCooldown'
import logger from '../helpers/logger'

import { Action } from '../../models/action'

import { testServer, devs } from '../../../config.json'

export async function isActionReady(
  action: Action,
  interaction: Interaction
): Promise<boolean> {
  if (
    !interaction.isChatInputCommand() &&
    !interaction.isButton() &&
    !interaction.isAnySelectMenu()
  )
    return false

  try {
    const actionName = interaction.isChatInputCommand()
      ? interaction.commandName
      : interaction.customId

    logger.info(
      `Action ${actionName} execution called by ${interaction.user.tag}`
    )

    // test only
    if (action.testOnly && interaction.guildId !== testServer) {
      await interaction.reply({
        content: 'This action availible only on test server',
        ephemeral: true,
      })
      logger.warn(
        `${interaction.user.tag} calls test only action on non-test server`
      )
      return false
    }

    // devs only
    if (action.devsOnly && !devs.includes(interaction.member.user.id)) {
      await interaction.reply({
        content: 'This action availible only for developers',
        ephemeral: true,
      })
      logger.warn(
        `${interaction.user.tag} calls developers only action without being a developer`
      )
      return false
    }

    // in cooldown
    const cooldown = getCooldown(action, interaction.user)
    const now = Date.now()

    if (cooldown > now) {
      await interaction.reply({
        content: `Cooldown <t:${Math.round(cooldown / 1000)}:R>`,
        ephemeral: true,
      })

      setTimeout(() => interaction.deleteReply(), cooldown - now)

      logger.warn(`${interaction.user.tag} calls action to often`)
      return false
    }

    // ready
    return true
  } catch (error) {
    logger.error(error)
    return false
  }
}
