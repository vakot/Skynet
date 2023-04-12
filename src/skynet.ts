import { Client, Collection, REST, Routes, Snowflake } from 'discord.js'

import { readdirSync } from 'fs'
import { join } from 'path'
import { config } from '../utils/config'

import { ISleshCommand, IMessageCommand } from '../models/command'
import { IComponent } from '../models/component'
import { IPlugin } from '../models/plugin'
import { IAction } from '../models/action'
import { logger } from '../utils/logger'

// Discord client object
class Skynet {
  // commands name => command body
  public commands = {
    slesh: new Collection<string, ISleshCommand>(),
    message: new Collection<string, IMessageCommand>(),
  }
  // button | menu => button body | menu body
  public components = new Collection<string, IComponent>()
  // button | menu => button body | menu body
  public plugins = new Collection<string, IPlugin>()
  // action => user id => cooldown created at
  public cooldowns = new Collection<string, Collection<Snowflake, number>>()

  public constructor(public readonly client: Client) {
    logger.log('Skynet Initializing')

    this.client.login(config.TOKEN).then(async () => {
      await this.setEvents().catch(logger.error)
      await this.setCommands().catch(logger.error)
      await this.setComponents().catch(logger.error)
      await this.setActions().catch(logger.error)
      await this.setPlugins().catch(logger.error)
      await this.deployGlobalCommands().catch(logger.error)
    })
  }

  // Event handling
  private async setEvents() {
    const path = join(__dirname, '..', 'events')
    const files = readdirSync(path).filter(
      (file) => file.endsWith('.js') || file.endsWith('.ts')
    )

    for (const file of files) {
      logger.log(`event ${file} loaded`)

      const filePath = join(path, file)
      const event = require(filePath).default

      if (event?.once) {
        this.client.once(event?.name, (...args) => event?.execute(...args))
      } else {
        this.client.on(event?.name, (...args) => event?.execute(...args))
      }
    }
  }

  // Set each command in the commands folder as a command in the collection
  private async setCommands() {
    const sleshPath = join(__dirname, '..', 'commands', 'slesh')
    const sleshFiles = readdirSync(sleshPath).filter(
      (file) => file.endsWith('.js') || file.endsWith('.ts')
    )

    const messagePath = join(__dirname, '..', 'commands', 'message')
    const messageFiles = readdirSync(messagePath).filter(
      (file) => file.endsWith('.js') || file.endsWith('.ts')
    )

    for (const file of sleshFiles) {
      logger.log(`/command ${file} loaded`)

      const filePath = join(sleshPath, file)
      const command: ISleshCommand = require(filePath).default

      await this.commands.slesh.set(command?.data?.name, command)
    }

    for (const file of messageFiles) {
      logger.log(`?command ${file} loaded`)

      const filePath = join(messagePath, file)
      const command: IMessageCommand = require(filePath).default

      await this.commands.message.set(
        command?.data?.prefix + command?.data?.name,
        command
      )
    }
  }

  // Set each component in the buttons/menus folder as a component in the collection
  private async setComponents() {
    const path = join(__dirname, '..', 'components')
    const files = readdirSync(path).filter(
      (file) => file.endsWith('.js') || file.endsWith('.ts')
    )

    for (const file of files) {
      logger.log(`component ${file} loaded`)

      const filePath = join(path, file)
      const component: IComponent = require(filePath).default

      await this.components.set(component?.data?.name, component)
    }
  }

  // Set unique and independent event handling functions
  private async setActions() {
    const path = join(__dirname, '..', 'actions')
    const files = readdirSync(path).filter(
      (file) => file.endsWith('.js') || file.endsWith('.ts')
    )

    for (const file of files) {
      logger.log(`action ${file} loaded`)

      const filePath = join(path, file)
      const action: IAction = require(filePath).default

      await this.client.on(action?.trigger, (...args) =>
        action?.execute(...args)
      )
    }
  }

  // Set each plugin in the plugins folder as a plugin in the collection
  private async setPlugins() {
    const path = join(__dirname, '..', 'plugins')
    const folders = readdirSync(path).filter((folder) => !folder.includes('.'))

    for (const folder of folders) {
      logger.log(`plugin ${folder} loaded`)

      const pluginPath = join(path, folder)
      const plugin: IPlugin = require(pluginPath).default

      plugin?.setup()

      this.plugins.set(plugin?.name, plugin)

      plugin?.commands?.slesh?.map((command) =>
        this.commands.slesh.set(command?.data?.name, command)
      )

      plugin?.commands?.message?.map((command) =>
        this.commands.message.set(
          command?.data?.prefix + command?.data?.name,
          command
        )
      )

      plugin?.components?.map((component) =>
        this.components.set(component?.data?.name, component)
      )

      plugin?.actions?.map((action) =>
        this.client.on(action?.trigger, (...args) => action?.execute(...args))
      )
    }
  }

  // Deploy all global application (/) commands
  private async deployGlobalCommands() {
    const commands = this.commands.slesh.map((command) => command.data.toJSON())

    const rest = new REST().setToken(config.TOKEN)

    logger.log(`Started reloading ${commands.length} /commands`)
    await rest.put(Routes.applicationCommands(config.CLIENT_ID), {
      body: commands,
    })
    logger.log(`Successfully reloaded ${commands.length} /commands`)
  }
}

export default Skynet
