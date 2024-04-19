import { ApplicationCommand, ApplicationCommandData, Client, Collection } from 'discord.js'
import mongoose from 'mongoose'

import * as SkynetActions from '@libs/actions'
import * as SkynetCommands from '@libs/commands'
import * as SkynetEventListeners from '@libs/listeners'

import { IAction } from '@models/action'

import { isCommandsEqual } from '@utils/command'
import { Logger } from '@utils/logger'

export class SkynetClient<Ready extends boolean = boolean> extends Client<Ready> {
  readonly logger = new Logger({ level: 5 })
  private _loadingStartAt: Date | undefined = undefined
  private _loadingEndedAt: Date | undefined = undefined

  public container = new Collection<string, any>()

  private _globalActions: Array<IAction> = []
  private _globalCommands: Array<ApplicationCommandData> = []

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
    this.loadSkynet()
  }

  private async loadSkynet() {
    this._loadingStartAt = new Date()
    await this.setupListeners()
    await this.setupDataBase()
    await this.setupBotInstance()
    await this.setupGlobalActions()
    await this.setupGlobalCommands()
    this._loadingEndedAt = new Date()
  }

  private async setupListeners(): Promise<void> {
    try {
      Object.values(SkynetEventListeners).forEach((event) =>
        this[event.once ? 'once' : 'on'](event.type, (...args) =>
          event.init(this, ...args).catch(this.logger.error)
        )
      )
    } catch (error) {
      this.disconnect(error)
    }
  }

  private async setupDataBase(): Promise<void> {
    try {
      await mongoose.connect(process.env.MONGODB_URI || '')
    } catch (error) {
      this.disconnect(error)
    }
  }

  private async setupBotInstance(): Promise<void> {
    try {
      await this.login(process.env.CLIENT_TOKEN || '')
      this.setMaxListeners(0)
    } catch (error) {
      this.disconnect(error)
    }
  }

  private async setupGlobalActions(): Promise<void> {
    try {
      this._globalActions = Object.values(SkynetActions)
      this._globalActions.forEach((action) =>
        this.on(action.event, (...args) => action.execute(this, ...args).catch(this.logger.error))
      )
    } catch (error) {
      this.disconnect(error)
    }
  }

  private async setupGlobalCommands(): Promise<void> {
    try {
      this._globalCommands = Object.values(SkynetCommands) as Array<ApplicationCommandData>
      this._globalCommands.forEach(async (command) => {
        const appCommand = await (
          await this.application?.commands.fetch()
        )?.find(({ name }) => command.name === name)

        if (!appCommand) {
          await this.application?.commands
            .create(command)
            .then((command) => this.logger.info(`[INFO] Command /${command?.name} created`))
        }

        if (appCommand && !isCommandsEqual(command as ApplicationCommand, appCommand)) {
          await this.application?.commands
            .edit(appCommand.id, command)
            .then((command) => this.logger.info(`[INFO] /${command?.name} updated`))
        }
      })
    } catch (error) {
      this.disconnect(error)
    }
  }

  private async disconnect(error?: any): Promise<void> {
    if (error) {
      this.logger.error(error)
    }

    mongoose.disconnect()
    this.destroy()
  }

  private async _drop(): Promise<void> {
    const commands = await this.application?.commands.fetch()

    commands?.forEach(
      async (command) =>
        await command
          .delete()
          .then((command) => this.logger.info(`[INFO] /${command?.name} deleted`))
    )
    this.disconnect()
  }
}
