import {
  Client,
  ClientEvents,
  Collection,
  REST,
  Routes,
  Snowflake,
} from 'discord.js'
import path from 'path'
import fs from 'fs'

import { IAction } from '../models/action'

import { throughDirectory } from '../utils/fileManager'
import { logger } from '../utils/logger'
import { config } from '../utils/config'

class Skynet {
  // name => body
  public actions = new Collection<string, IAction>()
  // name => body
  public commands = new Collection<string, any>()
  // action => (user id => cooldown created at)
  public cooldowns = new Collection<string, Collection<Snowflake, number>>()
  // listeners set
  public events = new Set<keyof ClientEvents>()

  public constructor(public readonly client: Client) {
    logger.log('[SYSTEM INITIALIZATION]')
    logger.log('RUNNING SKYSOFT KERNEL 4.92.384.42')

    try {
      ;(async () => {
        let loadingStart = Date.now()
        await this.client.login(config.TOKEN)
        await this.Setup()
        logger.info(`Loading took ${Date.now() - loadingStart}ms`)
      })()
    } catch {
      logger.error
    }
  }

  private async Setup() {
    // path to [action's | plugin's] folder's
    const actionsFolder = path.join(__dirname, '..', 'actions')
    const pluginsFolder = path.join(__dirname, '..', 'plugins')

    const isValidAction = (action: IAction): boolean => {
      try {
        if (!action.data.name) return false
        if (!action.listener.event) return false
        if (!action.init) return false
        if (!action.execute) return false
      } catch {
        return false
      }

      return true
    }

    const saveAction = async (action: IAction) => {
      if (!isValidAction(action))
        return logger.warn(`Invalid action [${action?.data?.name}] detected`)

      return await this.actions.set(action.data.name, action)
    }

    // read and save all action's
    for (const file of throughDirectory(actionsFolder)) {
      saveAction((await import(file)).default)
    }

    // read and save all action's
    for (const folder of fs.readdirSync(pluginsFolder)) {
      logger.log(`Plugin ${folder} loading...`)

      for (const file of throughDirectory(path.join(pluginsFolder, folder))) {
        saveAction((await import(file)).default)
      }
    }

    // set all event's
    this.actions.forEach((action) => {
      this.events.add(action.listener.event)
    })

    // run all client.on event's
    this.events.forEach(async (event) => {
      this.client.on(event, (...args) => {
        this.actions
          .filter(
            (action) => !action.listener.once && action.listener.event == event
          )
          .map((action) => action.init(...args))
      })
    })

    // run all client.once event's
    this.events.forEach(async (event) => {
      this.client.once(event, (...args) => {
        this.actions
          .filter(
            (action) => action.listener.once && action.listener.event == event
          )
          .map((action) => action.init(...args))
      })
    })

    // get all slash-command's
    const commands = this.actions
      .map((action) => action.data.command?.toJSON())
      .filter((command) => command)

    // save all slash-command's
    commands.forEach((command) => this.commands.set(command.name, command))

    // globally deploy all slash-command's
    try {
      logger.log(`[RELOADING COMMANDS]`)
      await new REST()
        .setToken(config.TOKEN)
        .put(Routes.applicationCommands(config.CLIENT_ID), {
          body: commands,
        })
      logger.log(`[${commands.length} COMMANDS RELOADED]`)
    } catch {
      logger.error
    }
  }
}

export default Skynet
