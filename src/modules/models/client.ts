import { ApplicationCommand, ApplicationCommandData, Client, Collection } from 'discord.js'
import mongoose from 'mongoose'

import { SkynetEventListeners } from '@libs/listeners'
import { SkynetActions } from '@modules/libs/actions'
import { SkynetCommands } from '@modules/libs/commands'
import { IAction } from '@modules/models/action'
import { isCommandsEqual } from '@utils/command'
import { Color, Logger } from '@utils/logger'

export class SkynetClient<Ready extends boolean = boolean> extends Client<Ready> {
  readonly logger = new Logger({ level: 5 })

  readonly successLoggerMark = this.logger.color('√ ', { foreground: Color.Green })
  readonly loadingLoggerMark = this.logger.color('◐ ', { foreground: Color.Magenta })

  public container = new Collection<string, any>()

  private _globalActions: Array<IAction> = []
  private _globalCommands: Array<ApplicationCommandData> = []

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
    this.logger.info(this.loadingLoggerMark + 'Loading started...')

    const loadingStartAt = new Date()
    await this.setupListeners()
    await this.setupDataBase()
    await this.setupBotInstance()
    await this.setupGlobalActions()
    await this.setupGlobalCommands()
    // await this._drop()
    const loadingEndedAt = new Date()

    const loadTime = loadingEndedAt.getTime() - loadingStartAt.getTime()
    const loadTimeColor =
      loadTime < 5_000 ? Color.Green : loadTime < 10_000 ? Color.Yellow : Color.Red
    const loadTimeFormat = this.logger.color(String(loadTime), { foreground: loadTimeColor })
    this.logger.info(this.loadingLoggerMark + `Loaded in ${loadTimeFormat}ms`)
  }

  private async setupListeners(): Promise<void> {
    try {
      SkynetEventListeners.forEach((event) =>
        this[event.once ? 'once' : 'on'](event.type, (...args) =>
          event.init(this, ...args).catch(this.logger.error)
        )
      )
      this.logger.log(this.successLoggerMark + 'Event listeners created successfully')
    } catch (error) {
      this.disconnect(error)
    }
  }

  private async setupDataBase(): Promise<void> {
    try {
      await mongoose.connect(process.env.MONGODB_TOKEN || '')
      this.logger.log(this.successLoggerMark + 'Connected to database successfully')
    } catch (error) {
      this.disconnect(error)
    }
  }

  private async setupBotInstance(): Promise<void> {
    try {
      await this.login(process.env.TOKEN || '')
      this.setMaxListeners(0)
      this.logger.log(this.successLoggerMark + `Logged in as ${this.user?.tag} successfully`)
    } catch (error) {
      this.disconnect(error)
    }
  }

  private async setupGlobalActions(): Promise<void> {
    try {
      this._globalActions = SkynetActions
      SkynetActions.forEach((action) =>
        this.on(action.event, (...args) => action.execute(this, ...args).catch(this.logger.error))
      )
      this.logger.log(this.successLoggerMark + 'Global actions registered successfully')
    } catch (error) {
      this.disconnect(error)
    }
  }

  private async setupGlobalCommands(): Promise<void> {
    try {
      this._globalCommands = SkynetCommands.map(
        (command) => command.toJSON() as ApplicationCommandData
      )
      SkynetCommands.forEach(async (command) => {
        const appCommand = await (
          await this.application?.commands.fetch()
        )?.find(({ name }) => command.name === name)

        if (!appCommand) {
          await this.application?.commands
            .create(command.toJSON())
            .then((command) => this.logger.info(`[INFO] Command /${command?.name} created`))
        }

        if (appCommand && !isCommandsEqual(command.toJSON() as ApplicationCommand, appCommand)) {
          await this.application?.commands
            .edit(appCommand.id, command.toJSON())
            .then((command) => this.logger.info(`[INFO] /${command?.name} updated`))
        }
      })
      this.logger.log(this.successLoggerMark + 'Global commands registered successfully')
    } catch (error) {
      this.disconnect(error)
    }
  }

  private async disconnect(error?: any): Promise<void> {
    if (error) {
      this.logger.error('Error appears while connectiong to database', error)
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
    this.logger.log(this.successLoggerMark + 'Bot instance dropped successfully')
    this.disconnect()
  }
}
