import compression from 'compression'
import {
  ApplicationCommand,
  ApplicationCommandData,
  Client,
  ClientOptions,
  Collection,
  Guild,
} from 'discord.js'
import express from 'express'
import mongoose from 'mongoose'
import path from 'path'

import * as SkynetActions from './libs/actions'
import * as SkynetCommands from './libs/commands'
import * as SkynetEventListeners from './libs/listeners'

import { IAction } from './models/action'

import { isCommand, isCommandsEqual } from './utils/command'
import { getFiles } from './utils/helpers/fileSystem'
import { Logger } from './utils/logger'

export class SkynetClient<Ready extends boolean = boolean> extends Client<Ready> {
  readonly logger = new Logger({ level: 5 })
  private _loadingStartAt: Date | undefined = undefined
  private _loadingEndedAt: Date | undefined = undefined

  public container = new Collection<string, any>()

  /**
   * @deprecated
   */
  private _globalActions: Array<IAction> = []
  /**
   * @deprecated
   */
  private _globalCommands = Object.values(SkynetCommands) as Array<ApplicationCommandData>

  public get loadingTime(): number {
    return (this._loadingEndedAt?.getTime() ?? 0) - (this._loadingStartAt?.getTime() ?? 0)
  }

  /**
   * @deprecated
   */
  public get globalActions(): Array<IAction> {
    return this._globalActions
  }

  /**
   * @deprecated
   */
  public get globalCommands(): Array<ApplicationCommandData> {
    return this._globalCommands
  }

  constructor(options: ClientOptions) {
    super(options)
    ;(async () => {
      this._loadingStartAt = new Date()
      await this.connect('Events', async () => await this.loadEvents())
      await this.connect('Database', async () => await this.loadDatabase())
      await this.connect('Client', async () => await this.loadClient())
      await this.connect('Server', async () => await this.loadServer())
      // await this.connect('Actions', async () => await this.loadGlobalActions())
      // await this.connect('Listeners', async () => await this.loadGlobalListeners())
      // await this.connect('Commands', async () => await this.loadGlobalCommands())
      this._loadingEndedAt = new Date()
    })()
    // await this._drop()
  }

  private async loadEvents(): Promise<void> {
    Object.values(SkynetEventListeners).forEach((event) => {
      this.logger.log(` ${this.logger.traceTag} ${event.type}`)
      this[event.once ? 'once' : 'on'](event.type, (...args) =>
        event.init(this, ...args).catch((error: any) => this.logger.error(error))
      )
    })
  }

  private async loadDatabase(): Promise<void> {
    if (process.env.MONGODB_URI) {
      await mongoose.connect(process.env.MONGODB_URI)
    } else {
      throw new Error('process.env.MONGODB_URI in not provided')
    }
  }

  private async loadClient(): Promise<void> {
    if (process.env.CLIENT_TOKEN) {
      await this.login(process.env.CLIENT_TOKEN)
      this.setMaxListeners(0)
    } else {
      throw new Error('process.env.CLIENT_TOKEN in not provided')
    }
  }

  private async loadServer(): Promise<void> {
    const baseURL = '/api'
    const server = express()

    server.use(express.urlencoded({ extended: true }))
    server.use(express.json())
    server.use(compression())

    const routers = getFiles<express.Router>(path.join(__dirname, 'routes'))

    for (const { data: router, path: routerPath } of routers) {
      server.use(baseURL, router)
      const routerPathFormat = routerPath.replace('index.ts', '').replace('.ts', '')
      this.logger.log(` ${this.logger.traceTag} ${baseURL}/${routerPathFormat}`)
    }

    server.listen(process.env.CLIENT_PORT || 4000)
  }

  /**
   * @deprecated will be replaced with admin UI in web-application
   */
  private async loadGlobalActions(): Promise<void> {
    this._globalActions = Object.values(SkynetActions)
    this._globalActions.forEach((action) => {
      this.logger.log(` ${this.logger.traceTag} ${action.name}`)
      this.on(action.event, (...args) =>
        action.execute(this, ...args).catch((error: any) => this.logger.error(error))
      )
    })
  }

  /**
   * @deprecated will be replaced with admin UI in web-application
   */
  private async loadGlobalListeners(): Promise<void> {
    Object.values(SkynetEventListeners).forEach((event) => {
      this.logger.log(` ${this.logger.traceTag} ${event.type}`)
      this[event.once ? 'once' : 'on'](event.type, (...args) =>
        event.init(this, ...args).catch((error: any) => this.logger.error(error))
      )
    })
  }

  /**
   * @deprecated will be replaced with admin UI in web-application
   */
  private async loadGlobalCommands(): Promise<void> {
    this._globalCommands = Object.values(SkynetCommands) as Array<ApplicationCommandData>
    const applicationCommands = await this.application?.commands.fetch()

    /* Create and update */
    this._globalCommands.forEach(async (command) => {
      const applicationCommand = applicationCommands?.find(({ name }) => command.name === name)

      if (!applicationCommand) {
        await this.application?.commands
          .create(command)
          .then((cmd) => this.logger.log(` ${this.logger.traceTag} /${cmd?.name} created`))
      } else if (!isCommandsEqual(command, applicationCommand as ApplicationCommandData)) {
        await this.application?.commands
          .edit(applicationCommand.id, command)
          .then((cmd) => this.logger.log(` ${this.logger.traceTag} /${cmd?.name} updated`))
      }
    })

    /* Delete */
    applicationCommands?.forEach(async (command) => {
      if (!this._globalCommands?.find(({ name }) => command.name === name)) {
        await command
          .delete()
          .then((cmd) => this.logger.log(` ${this.logger.traceTag} /${cmd?.name} deleted`))
      }
    })
  }

  async connect(name: string, callback: () => Promise<void> | void) {
    const startAt = new Date().getTime()
    try {
      this.logger.info(` ${this.logger.successTag} ${name} loading...`)
      await callback()
      const duration = new Date().getTime() - startAt
      const formatDuration =
        duration > 1000 ? (duration / 1000).toFixed(1) + 's' : duration.toFixed(0) + 'ms'
      this.logger.info(` ${this.logger.successTag} ${name} ready in ${formatDuration}`)
    } catch (error) {
      const duration = new Date().getTime() - startAt
      const formatDuration =
        duration > 1000 ? (duration / 1000).toFixed(1) + 's' : duration.toFixed(0) + 'ms'
      this.logger.info(` ${this.logger.errorTag} ${name} failed in ${formatDuration}`)
      this.disconnect(error)
    }
  }

  async disconnect(error?: any): Promise<void> {
    if (error) {
      this.logger.error(error)
    }

    mongoose.disconnect()
    this.destroy()

    process.exit(1)
  }

  private async _drop(): Promise<void> {
    const guilds = this.guilds.cache

    guilds.forEach(async (guild) => {
      const commands = await guild.commands.fetch()

      commands?.forEach(
        async (command) =>
          await command
            .delete()
            .then((cmd) =>
              this.logger.log(
                ` ${this.logger.traceTag} /${cmd.name} deleted for guild ${guild.name}`
              )
            )
      )
    })

    const commands = await this.application?.commands.fetch()

    commands?.forEach(
      async (command) =>
        await command
          .delete()
          .then((cmd) => this.logger.log(` ${this.logger.traceTag} /${cmd.name} deleted`))
    )
    this.disconnect()
  }

  async findCommand(
    id: string | undefined,
    guildId?: Guild['id']
  ): Promise<ApplicationCommand | undefined> {
    const commands = guildId
      ? await this.guilds.cache.get(guildId)?.commands.fetch()
      : await this.application?.commands.fetch()

    return commands?.find((command) => command.id === id)
  }

  async findCommands(
    ids: string[] | undefined,
    guildId?: Guild['id']
  ): Promise<ApplicationCommand[]> {
    const commands = guildId
      ? await this.guilds.cache.get(guildId)?.commands.fetch()
      : await this.application?.commands.fetch()

    const commandsArray = commands ? Array.from(commands.values()) : []

    return ids ? commandsArray.filter(({ id }) => ids.includes(id)) : commandsArray
  }

  async createCommand(
    command: ApplicationCommandData,
    guildId?: Guild['id']
  ): Promise<ApplicationCommand | undefined> {
    if (command && isCommand(command)) {
      return this.application?.commands.create(command, guildId)
    }
  }

  async updateCommand(
    id: string | undefined,
    command: ApplicationCommandData,
    guildId?: Guild['id']
  ): Promise<ApplicationCommand | undefined> {
    if (!id || !command || !isCommand(command)) {
      return
    }

    const remoteCommands = guildId
      ? await this.guilds.cache.get(guildId)?.commands.fetch()
      : await this.application?.commands.fetch()

    const remoteCommand = remoteCommands?.find((command) => command.id === id)

    if (!remoteCommand || !isCommand(remoteCommand)) {
      return
    }

    if (!isCommandsEqual(command, remoteCommand as ApplicationCommandData)) {
      return remoteCommand.edit(command)
    }
  }

  async deleteCommand(command: ApplicationCommand): Promise<ApplicationCommand | undefined> {
    if (command) {
      return command.delete()
    }
  }
}
