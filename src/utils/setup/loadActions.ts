import path from 'path'
import fs from 'fs'

import store from '../helpers/store'
import logger from '../helpers/logger'

import { Action } from '../../models/action'
import getActions from '../fetch/getActions'

export default async function () {
  const actionsFolder = path.join(__dirname, '..', '..', 'actions')
  const pluginsFolder = path.join(__dirname, '..', '..', 'plugins')

  // read all main actions
  const actions: Action[] = await getActions(actionsFolder)

  // read all plugins actions
  for (const pluginFolder of fs.readdirSync(pluginsFolder)) {
    logger.info(`Plugin ${pluginFolder} loadind...`)

    actions.push(...(await getActions(path.join(pluginsFolder, pluginFolder))))
  }

  // save all actions
  store.set('actions', actions)
}