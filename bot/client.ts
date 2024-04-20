import { ApplicationCommand, ApplicationCommandData, Client, Collection } from 'discord.js'
import mongoose from 'mongoose'

import * as SkynetActions from './libs/actions'
import * as SkynetCommands from './libs/commands'
import * as SkynetEventListeners from './libs/listeners'

import { IAction } from './models/action'

import { isCommandsEqual } from '@bot/utils/command'
import { Logger, Style } from './utils/logger'

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
    this._loadingStartAt = new Date()
    this.setupListeners()
    this.setupGlobalActions()
    this.setupGlobalCommands()
    this.setupDataBase()
    this.setupBotInstance()
  }

  private async setupListeners(): Promise<void> {
    try {
      this.logger.info(` ${this.logger.successTag} Listeners loading...`)
      Object.values(SkynetEventListeners).forEach((event) => {
        this.logger.log(` ${this.logger.traceTag} ${event.type}`)
        this[event.once ? 'once' : 'on'](event.type, (...args) =>
          event.init(this, ...args).catch(this.logger.error)
        )
      })
    } catch (error) {
      this.disconnect(error)
    }
  }

  private async setupDataBase(): Promise<void> {
    try {
      this.logger.info(
        ' ' + this.logger.color('✓ ', [Style.Bright, Style.FgGreen]) + 'DataBase loading...'
      )
      await mongoose.connect(process.env.MONGODB_URI || '')
    } catch (error) {
      this.disconnect(error)
    }
  }

  private async setupBotInstance(): Promise<void> {
    try {
      this.logger.info(` ${this.logger.successTag} Client loading...`)
      await this.login(process.env.CLIENT_TOKEN || '')
      this._loadingEndedAt = new Date()
      const formatTime =
        this.loadingTime > 1000
          ? (this.loadingTime / 1000).toFixed(1) + 's'
          : this.loadingTime.toFixed(0) + 'ms'
      this.logger.info(` ${this.logger.successTag} Ready in ${formatTime}`)
      this.setMaxListeners(0)
    } catch (error) {
      this.disconnect(error)
    }
  }

  private async setupGlobalActions(): Promise<void> {
    try {
      this.logger.info(` ${this.logger.successTag} Actions loading...`)
      this._globalActions = Object.values(SkynetActions)
      this._globalActions.forEach((action) => {
        this.logger.log(` ${this.logger.traceTag} ${action.name}`)
        this.on(action.event, (...args) => action.execute(this, ...args).catch(this.logger.error))
      })
    } catch (error) {
      this.disconnect(error)
    }
  }

  private async setupGlobalCommands(): Promise<void> {
    try {
      this.logger.info(` ${this.logger.successTag} Commands loading...`)
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
    } catch (error) {
      this.disconnect(error)
    }
  }

  private async disconnect(error?: any): Promise<void> {
    this.logger.info(` ${this.logger.errorTag} Failed to startup X_X`)

    if (error) {
      this.logger.error(error)
    }

    mongoose.disconnect()
    this.destroy()
  }

  // private async _drop(): Promise<void> {
  //   const commands = await this.application?.commands.fetch()

  //   commands?.forEach(
  //     async (command) =>
  //       await command
  //         .delete()
  //         .then((command) => this.logger.info(`[INFO] /${command?.name} deleted`))
  //   )
  //   this.disconnect()
  // }
}
