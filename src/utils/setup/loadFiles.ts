import path from 'path'
import fs from 'fs'

import getLocalCommands from '../fetch/getLocalCommands'
import getComponents from '../fetch/getComponents'
import getEvents from '../fetch/getEvents'
import logger from '../helpers/logger'
import store from '../helpers/store'

import { ICommand } from '../../models/command'
import { IComponent } from '../../models/component'

export default async function () {
  const eventsFolder = path.join(__dirname, '..', 'events')
  const commandsFolder = path.join(__dirname, '..', 'commands')
  const componentsFolder = path.join(__dirname, '..', 'components')
  const pluginsFolder = path.join(__dirname, '..', 'plugins')

  // read and save all events
  store.set('events', await getEvents(eventsFolder))

  // read all local commands and components
  const localCommands: ICommand[] = await getLocalCommands(commandsFolder)
  const components: IComponent[] = await getComponents(componentsFolder)

  // read all plugins local commands and components
  for (const folder of fs.readdirSync(pluginsFolder)) {
    logger.info(`Plugin ${folder} loading...`)
    const pluginCommandsFolder = path.join(pluginsFolder, folder, 'commands')
    const pluginComponentsFolder = path.join(pluginsFolder, folder, 'components')

    const pluginCommands = await getLocalCommands(pluginCommandsFolder)
    const pluginComponents = await getComponents(pluginComponentsFolder)

    localCommands.push(...pluginCommands)
    components.push(...pluginComponents)
  }

  // save all local commands and components
  store.set('localCommands', localCommands)
  store.set('components', components)
}
