import { Client, Collection, REST, Routes } from 'discord.js'

import { readdirSync } from 'fs'
import { join } from 'path'
import { config } from '../utils/config'

import { ISleshCommand, IMessageCommand } from '../models/command'
import { IComponent } from '../models/component'
import { IPlugin } from '../models/plugin'
import { IAction } from '../models/action'

// Discord client object
class Skynet {
  // commands name => command body
  public commands = new Collection<string, ISleshCommand>()
  // commands name => command body
  public messageCommands = new Collection<string, IMessageCommand>()
  // button | menu => button body | menu body
  public components = new Collection<string, IComponent>()
  // button | menu => button body | menu body
  public plugins = new Collection<string, IPlugin>()
  // action => user id => cooldown created at
  public cooldowns = new Collection<string, Collection<string, number>>()

  public constructor(public readonly client: Client) {
    this.client.login(config.TOKEN)
    ;(async () => {
      await this.setEvents()
      await this.setCommands()
      await this.setMessageCommands()
      await this.setComponents()
      await this.setActions()
      await this.setPlugins()
      await this.deployGlobalCommands()
    })()
  }

  // Event handling
  private async setEvents() {
    console.log('EVENT LISTENERS')

    const path = join(__dirname, '..', 'events')
    const files = readdirSync(path).filter(
      (file) => file.endsWith('.js') || file.endsWith('.ts')
    )

    await files.forEach((file, index) => {
      console.log(
        `${index == files.length - 1 ? '└' : '├'}─File ${file} loaded`
      )

      const filePath = join(path, file)
      const event = require(filePath)

      if (event.once) {
        this.client.once(event.name, (...args) => event.execute(...args))
      } else {
        this.client.on(event.name, (...args) => event.execute(...args))
      }
    })
  }

  // Set each command in the commands folder as a sleshCommand in the collection
  private async setCommands() {
    console.log('COMMANDS')

    const path = join(__dirname, '..', 'commands')
    const files = readdirSync(path).filter(
      (file) => file.endsWith('.js') || file.endsWith('.ts')
    )

    await files.forEach((file, index) => {
      console.log(
        `${index == files.length - 1 ? '└' : '├'}─File ${file} loaded`
      )
      const filePath = join(path, file)
      const command: ISleshCommand = require(filePath).default

      this.commands.set(command.data.name, command)
      this.cooldowns.set(command.data.name, new Collection())
    })
  }

  // Set each command in the commands folder as a messageCommand in the collection
  private async setMessageCommands() {
    console.log('MESSAGE COMMANDS')

    const path = join(__dirname, '..', 'messageCommands')
    const files = readdirSync(path).filter(
      (file) => file.endsWith('.js') || file.endsWith('.ts')
    )

    await files.forEach((file, index) => {
      console.log(
        `${index == files.length - 1 ? '└' : '├'}─File ${file} loaded`
      )

      const filePath = join(path, file)
      const command: IMessageCommand = require(filePath).default

      this.messageCommands.set(command.data.prefix + command.data.name, command)
      this.cooldowns.set(
        command.data.prefix + command.data.name,
        new Collection()
      )
    })
  }

  // Set each component in the buttons/menus folder as a messageComponents in the collection
  private async setComponents() {
    console.log('COMPONENTS')

    const path = join(__dirname, '..', 'components')
    const files = readdirSync(path).filter(
      (file) => file.endsWith('.js') || file.endsWith('.ts')
    )

    await files.forEach((file, index) => {
      console.log(
        `${index == files.length - 1 ? '└' : '├'}─File ${file} loaded`
      )

      const filePath = join(path, file)
      const button: IComponent = require(filePath).default

      this.components.set(button.data.name, button)
      this.cooldowns.set(button.data.name, new Collection())
    })
  }

  // Set unique and independent event handling functions
  private async setActions() {
    console.log('ACTIONS')

    const path = join(__dirname, '..', 'actions')
    const files = readdirSync(path).filter(
      (file) => file.endsWith('.js') || file.endsWith('.ts')
    )

    await files.forEach((file, index) => {
      console.log(
        `${index == files.length - 1 ? '└' : '├'}─File ${file} loaded`
      )
      const filePath = join(path, file)
      const action: IAction = require(filePath).default

      this.client.on(action.trigger, (...args) => action.execute(...args))
    })
  }

  // Set each plugin in the plugins folder as a plugin in the collection
  private async setPlugins() {
    console.log('PLUGINS')

    const path = join(__dirname, '..', 'plugins')
    const folders = readdirSync(path).filter((folder) => !folder.includes('.'))

    await folders.forEach((folder) => {
      console.log(`└─File ${folder} loaded`)

      const pluginPath = join(path, folder)
      const plugin: IPlugin = require(pluginPath).default

      plugin.setup()

      this.plugins.set(plugin.name, plugin)

      plugin.commands.map((command) =>
        this.commands.set(command.data.name, command)
      )

      plugin.messageCommands.map((command) =>
        this.messageCommands.set(
          command.data.prefix + command.data.name,
          command
        )
      )

      plugin.components.map((component) =>
        this.components.set(component.data.name, component)
      )

      if (plugin.actions) {
        plugin.actions.map((action) =>
          this.client.on(action.trigger, (...args) => action.execute(...args))
        )
      }
    })
  }

  // Deploy all global application (/) commands
  private async deployGlobalCommands() {
    const commands = this.commands.map((command) => command.data.toJSON())

    const rest = new REST().setToken(config.TOKEN)

    try {
      console.log('\nStarted refreshing application (/) commands')

      await rest.put(Routes.applicationCommands(config.CLIENT_ID), {
        body: commands,
      })

      console.log(
        `Successfully reloaded [${commands.length}] application (/) commands\n`
      )
    } catch (error) {
      console.error('Exception' + error)
    }
  }
}

export default Skynet
