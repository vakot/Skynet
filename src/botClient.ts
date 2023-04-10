import { Client, Collection, REST, Routes } from 'discord.js'

import { readdirSync } from 'fs'
import { join } from 'path'

import { config } from '../utils/config'
import { ISleshCommand, IMessageCommand } from '../models/command'
import { IComponent } from '../models/component'

// Discord client object
class BotClient {
  // commands name => command body
  public commands = new Collection<string, ISleshCommand>()
  public prefix = '!'
  // commands name => command body
  public messageCommands = new Collection<string, IMessageCommand>()
  // button | menu => button body | menu body
  public components = new Collection<string, IComponent>()
  // action => user id => cooldown created at
  public cooldowns = new Collection<string, Collection<string, number>>()

  public constructor(public readonly client: Client) {
    this.client.login(config.TOKEN)
    ;(async () => {
      await this.setEvents()
      await this.setCommands()
      await this.setMessageCommands()
      await this.setComponents()
      await this.deployGlobalCommands()
    })()
  }

  // Event handling
  private async setEvents() {
    console.log('[EVENT LISTENERS LOADING]')

    const eventsPath = join(__dirname, '..', 'events')
    const eventFiles = readdirSync('./events').filter(
      (file) => file.endsWith('.js') || file.endsWith('.ts')
    )

    for (const file of eventFiles) {
      console.log(`File ${file} loaded`)

      const filePath = join(eventsPath, file)
      const event = require(filePath)

      if (event.once) {
        await this.client.once(event.name, (...args) => event.execute(...args))
      } else {
        await this.client.on(event.name, (...args) => event.execute(...args))
      }
    }

    console.log('[EVENT LISTENERS LOADED]\n')
  }

  // Set each command in the commands folder as a command in the collection
  private async setCommands() {
    console.log('[SLESH COMMANDS LOADING]')

    const path = join(__dirname, '..', 'commands')
    const files = readdirSync('./commands').filter(
      (file) => file.endsWith('.js') || file.endsWith('.ts')
    )

    for (const file of files) {
      console.log(`File ${file} loaded`)

      const filePath = join(path, file)
      const command = require(filePath)

      await this.commands.set(command.default.data.name, command.default)
      await this.cooldowns.set(command.default.data.name, new Collection())
    }

    console.log('[SLESH COMMANDS LOADED]\n')
  }

  // Set each command in the commands folder as a messageCommand in the collection
  private async setMessageCommands() {
    console.log('[MESSAGE COMMANDS LOADING]')

    const path = join(__dirname, '..', 'messageCommands')
    const files = readdirSync('./messageCommands').filter(
      (file) => file.endsWith('.js') || file.endsWith('.ts')
    )

    for (const file of files) {
      console.log(`File ${file} loaded`)

      const filePath = join(path, file)
      const command = require(filePath)

      await this.messageCommands.set(
        command.default.data.preffix + command.default.data.name,
        command.default
      )
      await this.cooldowns.set(
        command.default.data.preffix + command.default.data.name,
        new Collection()
      )
    }

    console.log('[MESSAGE COMMANDS LOADED]\n')
  }

  // Set each component in the buttons/menus folder as a messageComponents in the collection
  private async setComponents() {
    console.log('[COMPONENTS LOADING]')

    const path = join(__dirname, '..', 'components')
    const files = readdirSync('./components').filter(
      (file) => file.endsWith('.js') || file.endsWith('.ts')
    )

    for (const file of files) {
      console.log(`File ${file} loaded`)

      const filePath = join(path, file)
      const button = require(filePath)

      await this.components.set(button.default.data.name, button.default)
    }

    console.log('[COMPONENTS LOADED]\n')
  }

  // Deploy all global application (/) commands
  private async deployGlobalCommands() {
    const commands = this.commands.map((cmd) => cmd.data.toJSON())

    const rest = new REST().setToken(config.TOKEN)

    try {
      console.log('Started refreshing application (/) commands')

      await rest.put(Routes.applicationCommands(config.CLIENT_ID), {
        body: commands,
      })

      console.log(
        `Successfully reloaded [${commands.length}] application (/) commands\n`
      )
    } catch (error) {
      console.error(error)
    }
  }
}

export default BotClient
