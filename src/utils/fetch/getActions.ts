import { throughDirectory } from '../helpers/throughDirectory'
import logger from '../helpers/logger'

import { Action } from '../../models/action'

export async function getActions(path: string): Promise<Action[]> {
  const actions: Action[] = []

  for (const actionPath of throughDirectory(path)) {
    const actionFileName = actionPath.replace(/\\/g, '/').split('/').pop()

    if (!actionPath.endsWith('.ts') && !actionPath.endsWith('.js')) {
      logger.info(`File ${actionFileName} ignored`)
      continue
    }

    const action: Action = (await import(actionPath))?.default

    if (!action?.execute) {
      logger.warn(`File ${actionFileName} unresolvable`)
      continue
    }

    logger.log(`File ${actionFileName} loaded`)

    actions.push(action)
  }

  return actions
}
