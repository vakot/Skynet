import path from 'path'

import { Client } from '../../models/client'
import { DataBaseAction } from '../../models/dbaction'

import { getFiles } from '../helpers/fileSystem'

export async function loadDBActions(client: Client): Promise<void> {
  const dbactionsPath = path.join(__dirname, '..', '..', 'mongo')

  const dbactions = await getFiles(dbactionsPath, DataBaseAction)

  dbactions.forEach((action) =>
    client.dataBaseActions.set(action.data.name, action)
  )
}
