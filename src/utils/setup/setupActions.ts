import path from 'path'
import fs from 'fs'

import { getFiles } from '../helpers/fileSystem'
import store from '../helpers/store'
import logger from '../helpers/logger'

import { Action, ActionSchema } from '../../models/action'

export async function setupActions() {
  const actionsFolder = path.join(__dirname, '..', '..', 'actions')
  const pluginsFolder = path.join(__dirname, '..', '..', 'plugins')

  // read all main actions
  const actions: Action[] = await getFiles<Action>(actionsFolder, ActionSchema)

  // read all plugins actions
  for (const pluginFolder of fs.readdirSync(pluginsFolder)) {
    logger.info(`Plugin ${pluginFolder} loadind...`)

    const pluginPath = path.join(pluginsFolder, pluginFolder)
    const pluginActions = await getFiles<Action>(pluginPath, ActionSchema)

    actions.push(...pluginActions)
  }

  // save all actions
  store.set('actions', actions)
}
