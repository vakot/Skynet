import { join } from 'path'
import { readdirSync } from 'fs'

import { ISleshCommand, IMessageCommand } from '../models/command'
import { IPlugin } from '../models/plugin'
import { IComponent } from '../models/component'
import { IAction } from '../models/action'

import { logger } from '../utils/logger'

export function loadPlugin(plugin: IPlugin) {
  // if [item] folder exist - read
  // else - ignore
  getCommands(plugin).catch(() => {})
  getComponents(plugin).catch(() => {})
  getActions(plugin).catch(() => {})
}

const basePath = join(__dirname, '..', 'plugins')

// Set each command in the commands folder as a command in the collection
async function getCommands(plugin: IPlugin) {
  const sleshPath = join(basePath, plugin.name, 'commands/slesh')
  const sleshFiles = readdirSync(sleshPath).filter(
    (file) => file.endsWith('.js') || file.endsWith('.ts')
  )

  for (const file of sleshFiles) {
    logger.log(`/command ${file} loaded`)

    const filePath = join(sleshPath, file)
    const command: ISleshCommand = require(filePath).default

    plugin.commands.slesh.push(command)
  }

  const messagePath = join(basePath, plugin.name, 'commands/message')
  const messageFiles = readdirSync(messagePath).filter(
    (file) => file.endsWith('.js') || file.endsWith('.ts')
  )

  for (const file of messageFiles) {
    logger.log(`?command ${file} loaded`)

    const filePath = join(messagePath, file)
    const command: IMessageCommand = require(filePath).default

    plugin.commands.message.push(command)
  }
}

// Set each component in the buttons/menus folder as a component in the collection
async function getComponents(plugin: IPlugin) {
  const path = join(__dirname, '..', 'plugins', plugin.name, 'components')
  const files = readdirSync(path).filter(
    (file) => file.endsWith('.js') || file.endsWith('.ts')
  )

  for (const file of files) {
    logger.log(`component ${file} loaded`)

    const filePath = join(path, file)
    const component: IComponent = require(filePath).default

    plugin.components.push(component)
  }
}

// Set unique and independent event handling functions
async function getActions(plugin: IPlugin) {
  const path = join(basePath, plugin.name, 'actions')
  const files = readdirSync(path).filter(
    (file) => file.endsWith('.js') || file.endsWith('.ts')
  )

  for (const file of files) {
    logger.log(`action ${file} loaded`)

    const filePath = join(path, file)
    const action: IAction = require(filePath).default

    plugin.actions.push(action)
  }
}
