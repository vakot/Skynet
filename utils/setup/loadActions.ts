import path from 'path'

import { SkynetClient } from '@modules/models/client'
import { Action, DataBaseAction } from '@modules/models/action'

import { getFiles } from '@utils/helpers/fileSystem'
import logger from '@utils/helpers/logger'

export async function loadActions(client: SkynetClient): Promise<void> {
  const actionsPath = path.join(__dirname, '..', '..', 'actions')

  logger.debug('Actions loading')

  const actions = await getFiles(actionsPath, Action)

  actions.forEach((action) => client.clientActions.set(action.data.name, action))

  const mongoActionsPath = path.join(__dirname, '..', '..', 'mongo')

  logger.debug('DataBase actions loading')

  const mongoActions = await getFiles(mongoActionsPath, DataBaseAction)

  mongoActions.forEach((action) => client.dataBaseActions.set(action.data.name, action))
}
