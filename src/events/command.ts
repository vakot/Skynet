import { Events } from 'discord.js'

import logger from '../utils/helpers/logger'
import isCooldown from '../utils/conditions/isCooldown'
import store from '../utils/helpers/store'

import { IEvent } from '../models/event'
import { ICommand } from '../models/command'

import { devs, testServer } from '../../config.json'

export default {
  name: Events.InteractionCreate,

  async execute(interaction) {
    if (!interaction.isChatInputCommand()) return

    const { commandName } = interaction

    logger.info(`Command /${commandName} execution called by ${interaction.user.tag}`)

    try {
      const localCommands = store.get('localCommands')

      const command: ICommand = await localCommands.find((cmd) => cmd.data.name === commandName)

      if (!command) throw `Command /${commandName} isn't exist`

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

      if (isCooldown(commandName, command.cooldown, interaction)) return

      command.execute(interaction)
    } catch (error) {
      logger.error(error)
    }
  },
} as IEvent
