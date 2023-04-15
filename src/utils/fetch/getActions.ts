import throughDirectory from '../helpers/throughDirectory'
import logger from '../helpers/logger'

import { IAction } from '../../models/action'

export default async function (path: string): Promise<IAction[]> {
  const actions: IAction[] = []

  for (const actionPath of throughDirectory(path)) {
    const actionFileName = actionPath.replace(/\\/g, '/').split('/').pop()

    if (!actionPath.endsWith('.ts') && !actionPath.endsWith('.js')) {
      logger.info(`File ${actionFileName} ignored`)
      continue
    }

    const action: IAction = (await import(actionPath))?.default

    if (!action?.execute) {
      logger.warn(`File ${actionFileName} is unresolvable`)
      continue
    }

    logger.log(`File ${actionFileName} loaded`)

    actions.push(action)
  }

  return actions
}
