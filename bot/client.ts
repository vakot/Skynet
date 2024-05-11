import { ApplicationCommand, ApplicationCommandData, Client, Collection } from 'discord.js'
import mongoose from 'mongoose'

import * as SkynetActions from './libs/actions'
import * as SkynetCommands from './libs/commands'
import * as SkynetEventListeners from './libs/listeners'

import { IAction } from './models/action'

import { isCommandsEqual } from '@bot/utils/command'
import { Logger } from './utils/logger'

export class SkynetClient<Ready extends boolean = boolean> extends Client<Ready> {
  readonly logger = new Logger({ level: 5 })
  private _loadingStartAt: Date | undefined = undefined
  private _loadingEndedAt: Date | undefined = undefined

  public container = new Collection<string, any>()

  private _globalActions: Array<IAction> = []
  private _globalCommands = Object.values(SkynetCommands) as Array<ApplicationCommandData>

  public get loadingTime(): number {
    return (this._loadingEndedAt?.getTime() ?? 0) - (this._loadingStartAt?.getTime() ?? 0)
  }

  public get globalActions(): Array<IAction> {
    return this._globalActions
  }

  public get globalCommands(): Array<ApplicationCommandData> {
    return this._globalCommands
  }

  constructor(options: any) {
    super(options)

    const load = async () => {
      this._loadingStartAt = new Date()
      // await this.connect('Actions', async () => await this.loadGlobalActions())
      // await this.connect('Listeners', async () => await this.loadGlobalListeners())
      await this.connect('Events', async () => await this.loadEvents())
      await this.connect('Database', async () => await this.loadDatabase())
      await this.connect('Client', async () => await this.loadClient())
      // await this.connect('Commands', async () => await this.loadGlobalCommands())
      // await this._drop()
    }

    load()
  }

  private async loadGlobalListeners(): Promise<void> {
    // Object.values(SkynetEventListeners).forEach((event) => {
    //   this.logger.log(` ${this.logger.traceTag} ${event.type}`)
    //   this[event.once ? 'once' : 'on'](event.type, (...args) =>
    //     event.init(this, ...args).catch((error: any) => this.logger.error(error))
    //   )
    // })
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
    await mongoose.connect(process.env.MONGODB_URI || '')
  }

  private async loadClient(): Promise<void> {
    await this.login(process.env.CLIENT_TOKEN || '')
    this._loadingEndedAt = new Date()
    this.setMaxListeners(0)
  }

  private async loadGlobalActions(): Promise<void> {
    this._globalActions = Object.values(SkynetActions)
    this._globalActions.forEach((action) => {
      this.logger.log(` ${this.logger.traceTag} ${action.name}`)
      this.on(action.event, (...args) =>
        action.execute(this, ...args).catch((error: any) => this.logger.error(error))
      )
    })
  }

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
      } else if (isCommandsEqual(command as ApplicationCommand, applicationCommand)) {
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
}
