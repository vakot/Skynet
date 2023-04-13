import { Client, Collection, REST, Routes, Snowflake } from 'discord.js'
import path from 'path'
import fs from 'fs'

import { IAction } from '../models/action'

import { throughDirectory } from '../utils/throughDirectory'
import { logger } from '../utils/logger'

import { config } from '../utils/config'

class Skynet {
  // name => body
  public actions = new Collection<string, IAction>()
  // name => body
  public commands = new Collection<string, any>()
  // action => (user id => cooldown created at)
  public cooldowns = new Collection<string, Collection<Snowflake, number>>()

  public constructor(public readonly client: Client) {
    logger.log('[SYSTEM INITIALIZATION]')
    logger.log('RUNNING SKYSOFT KERNEL 4.92.384.42')

    this.client
      .login(config.TOKEN)
      .then(async () => {
        await this.Setup()
      })
      .catch(logger.error)
  }

  private async Setup() {
    // path to [action's | plugin's] folder's
    const actionsFolder = path.join(__dirname, '..', 'actions')
    const pluginsFolder = path.join(__dirname, '..', 'plugins')

    // read and save all action's
    for (const file of throughDirectory(actionsFolder)) {
      const action: IAction = require(file).default
      await this.actions.set(action?.data?.name, action)
      await action.init(this.client).catch(logger.error)
    }

    // read and save all plugin's action's
    for (const folder of fs.readdirSync(pluginsFolder)) {
      logger.log(`Plugin ${folder} loading...`)

      for (const file of throughDirectory(path.join(pluginsFolder, folder))) {
        const action: IAction = require(file).default
        await this.actions.set(action?.data?.name, action)
        await action.init(this.client).catch(logger.error)
      }
    }

    // get all slash-command's
    const commands = this.actions
      .map((action) => action.data.command?.toJSON())
      .filter((command) => command)

    // save all slash-command's
    commands.forEach((command) => this.commands.set(command.name, command))

    // globally deploy all slash-command's
    logger.log(`[RELOADING COMMANDS]`)
    await new REST()
      .setToken(config.TOKEN)
      .put(Routes.applicationCommands(config.CLIENT_ID), {
        body: commands,
      })
      .then(() => logger.log(`[${commands.length} COMMANDS RELOADED]`))
      .catch(logger.error)
  }
}

export default Skynet
