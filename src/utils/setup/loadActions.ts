import path from 'path'

import { Client } from '../../models/Client'
import { Action } from '../../models/Action'

import { getFiles } from '../helpers/fileSystem'

export async function loadActions(client: Client): Promise<void> {
  const actionsPath = path.join(__dirname, '..', '..', 'actions')

  const actions = await getFiles(actionsPath, Action)

  actions.forEach((action) => client.localActions.set(action.data.name, action))
}
