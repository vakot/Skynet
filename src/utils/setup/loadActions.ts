import path from 'path'

import { Client } from '../../models/client'
import { Action } from '../../models/action'

import { getFiles } from '../helpers/fileSystem'

export async function loadActions(client: Client): Promise<void> {
  const actionsPath = path.join(__dirname, '..', '..', 'actions')

  const actions = await getFiles(actionsPath, Action)

  actions.forEach((action) => client.localActions.set(action.data.name, action))
}
