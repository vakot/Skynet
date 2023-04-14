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
import { IListener } from '../models/listener'

import { throughDirectory } from '../utils/fileManager'
import { logger } from '../utils/logger'
import { config } from '../utils/config'

let loadingStart

class Skynet {
  // name => body
  public actions = new Collection<string, IAction>()
  // name => body
  public commands = new Collection<string, any>()
  // action => (user id => cooldown created at)
  public cooldowns = new Collection<string, Collection<Snowflake, number>>()
  // listener => actions
  public events = new Collection<keyof ClientEvents, string[]>()

  public constructor(public readonly client: Client) {
    loadingStart = Date.now()

    logger.log('[SYSTEM INITIALIZATION]')
    logger.log('RUNNING SKYSOFT KERNEL 4.92.384.42')

    try {
      this.Login(this.client)
      this.Setup()
    } catch {
      logger.error
    }
  }

  private async Login(client: Client) {
    await client.login(config.TOKEN)
    await client.setMaxListeners(0)
  }

  private async Setup() {
    // path to [action's | plugin's] folder's
    const actionsFolder = path.join(__dirname, '..', 'actions')
    const pluginsFolder = path.join(__dirname, '..', 'plugins')

    const saveAction = async (action: IAction) => {
      if (!Object.keys(action).length) return

      await this.actions.set(action?.data?.name, action)
    }

    // read and save all action's
    for (const file of throughDirectory(actionsFolder)) {
      saveAction((await import(file)).default)
    }

    this.actions.forEach(async (action) => {
      if (this.events.has(action.listener.event)) {
        await this.events.set(action.listener.event, [
          ...this.events.get(action.listener.event),
          action.data.name,
        ])
      } else {
        await this.events.set(action.listener.event, [action.data.name])
      }
    })

    // // read and save all plugin's action's
    // for (const folder of fs.readdirSync(pluginsFolder)) {
    //   logger.log(`Plugin ${folder} loading...`)

    //   for (const file of throughDirectory(path.join(pluginsFolder, folder))) {
    //     saveAction((await import(file)).default)
    //   }
    // }

    // run all events
    // console.log(this.events.size)
    await [...this.events.keys()].forEach((event) => {
      this.client.on(event, (...args) => {
        this.actions
          .filter((action) => action.listener.event == event)
          .map((action) => action.init(...args))
      })
    })

    // this.events.forEach(event => {
    //   if (event)
    // })
    // this.client.on('cacheSweep', () => {})
    // this.client.once('channelCreate', () => {})

    // const eventListeners = [...this.events.keys()]
    // eventListeners.forEach((event) => {
    //   this.events.
    // })
    // .map((event) => console.log(event))

    // this.events.forEach((event) => {
    //   console.log(event)

    //   this.client
    // })

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
      logger.info(`Loaded in ${Date.now() - loadingStart}ms`)
    } catch {
      logger.error
    }
  }
}

export default Skynet
