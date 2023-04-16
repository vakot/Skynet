import { Interaction } from 'discord.js'

import logger from '../helpers/logger'
import isCooldown from './isCooldown'

import { Action } from '../../models/action'

import { testServer, devs } from '../../../config.json'

export default async function (
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

    if (!action) {
      await interaction.reply({
        content: 'No action matching your request detected',
        ephemeral: true,
      })
      return false
    }

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

    if (isCooldown(action, interaction)) {
      logger.warn(`${interaction.user.tag} calls action to often`)
      return false
    }

    return true
  } catch (error) {
    logger.error(error)
    return false
  }
}
