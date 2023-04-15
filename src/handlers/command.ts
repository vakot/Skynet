import { ChatInputCommandInteraction } from 'discord.js'
import { devs, testServer } from '../../config.json'
import { ICommand } from '../models/command'
import logger from '../utils/logger'
import store from '../utils/store'
import { isInteractionCooldown } from '../utils/cooldownHandler'

export default async function (interaction: ChatInputCommandInteraction) {
  const localCommands = store.get('localCommands')

  console.log(localCommands)

  try {
    const command: ICommand = await localCommands.find(
      (cmd) => cmd.data.name === interaction.commandName
    )

    if (!command) throw `Command /${interaction.commandName} isn't exist`

    if (command.testOnly && interaction.guildId !== testServer) {
      return await interaction.reply({
        content: 'This command availible only on test server',
        ephemeral: true,
      })
    }

    if (command.devsOnly && !devs.includes(interaction.member.user.id)) {
      return await interaction.reply({
        content: 'This command availible only for developers',
        ephemeral: true,
      })
    }

    if (isInteractionCooldown(interaction)) return

    command.callback(interaction)
  } catch (error) {
    logger.error(error)
  }
}
