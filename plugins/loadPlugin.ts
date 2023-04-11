import { join } from 'path'
import { readdirSync } from 'fs'

import { ISleshCommand, IMessageCommand } from '../models/command'
import { IPlugin } from '../models/plugin'
import { IComponent } from '../models/component'

export async function loadPlugin(plugin: IPlugin) {
  // if [item] folder exist - read
  // else - ignore
  getCommands(plugin).catch(() => {})
  getMessageCommands(plugin).catch(() => {})
  getComponents(plugin).catch(() => {})
}

// Get each command in the commands folder as a sleshCommand in the collection
async function getCommands(plugin: IPlugin) {
  const path = join(__dirname, '.', plugin.name, 'commands')
  const files = readdirSync(path).filter(
    (file) => file.endsWith('.js') || file.endsWith('.ts')
  )

  await files.forEach((file, index) => {
    console.log(
      `  ${index == files.length - 1 ? '└' : '├'}─File ${file} loaded`
    )

    const filePath = join(path, file)
    const command: ISleshCommand = require(filePath).default

    plugin.commands.push(command)
  })
}

// Get each command in the commands folder as a messageCommand in the collection
async function getMessageCommands(plugin: IPlugin) {
  const path = join(__dirname, '.', plugin.name, 'messageCommands')
  const files = readdirSync(path).filter(
    (file) => file.endsWith('.js') || file.endsWith('.ts')
  )

  await files.forEach((file, index) => {
    console.log(
      `  ${index == files.length - 1 ? '└' : '├'}─File ${file} loaded`
    )

    const filePath = join(path, file)
    const command: IMessageCommand = require(filePath).default

    plugin.messageCommands.push(command)
  })
}

// Get each component in the buttons/menus folder as a messageComponents in the collection
async function getComponents(plugin: IPlugin) {
  const path = join(__dirname, '.', plugin.name, 'components')
  const files = readdirSync(path).filter(
    (file) => file.endsWith('.js') || file.endsWith('.ts')
  )

  await files.forEach((file, index) => {
    console.log(
      `  ${index == files.length - 1 ? '└' : '├'}─File ${file} loaded`
    )

    const filePath = join(path, file)
    const component: IComponent = require(filePath).default

    plugin.components.push(component)
  })
}
