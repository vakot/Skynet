import path from 'path'
import fs from 'fs'

import { SkynetClient } from '../../models/client'
import { Action } from '../../models/action'

import { getFiles } from '../helpers/fileSystem'
import logger from '../helpers/logger'

export async function loadPlugins(client: SkynetClient): Promise<void> {
  const pluginsPath = path.join(__dirname, '..', '..', 'plugins')

  for (const pluginFolder of await fs.readdirSync(pluginsPath)) {
    const pluginPath = path.join(pluginsPath, pluginFolder)

    logger.debug(`Plugin <${pluginFolder}> loading`)

    const actions = await getFiles(pluginPath, Action)

    actions.forEach((action) => client.localActions.set(action.data.name, action))
  }
}
