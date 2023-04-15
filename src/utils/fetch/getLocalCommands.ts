import throughDirectory from '../helpers/throughDirectory'
import logger from '../helpers/logger'

import { ICommand } from '../../models/command'

export default async function (path: string): Promise<ICommand[]> {
  const commands: ICommand[] = []

  for (const commandPath of throughDirectory(path)) {
    const commandFileName = commandPath.replace(/\\/g, '/').split('/').pop()

    if (!commandPath.endsWith('.ts') && !commandPath.endsWith('.js')) {
      logger.info(`File ${commandFileName} skipped`)
      continue
    }

    const command: ICommand = (await import(commandPath))?.default

    if (!command?.data || !command?.execute) {
      logger.warn(`File ${commandFileName} is unresolvable`)
      continue
    }

    logger.log(`File ${commandFileName} loaded`)

    commands.push(command)
  }

  return commands
}
