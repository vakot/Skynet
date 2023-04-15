import { Interaction } from 'discord.js'
import commandHandler from '../handlers/command'
import componentHandler from '../handlers/component'
import logger from '../utils/logger'

export default async function (interaction: Interaction) {
  if (interaction.isChatInputCommand()) {
    logger.info(
      `Command /${interaction.commandName} execution called by ${interaction.user.tag}`
    )
    return await commandHandler(interaction)
  }

  if (interaction.isAnySelectMenu() || interaction.isButton()) {
    logger.info(
      `Component ${interaction.customId} execution called by ${interaction.user.tag}`
    )
    return await componentHandler(interaction)
  }
}
