import logger from './logger'
import path from 'path'
import { throughDirectory } from './throughDirectory'
import store from './store'

export default async function () {
  const commandsFolder = path.join(__dirname, '..', 'commands')

  const commands = []

  for (const commandPath of throughDirectory(commandsFolder)) {
    const commandFileName = commandPath.replace(/\\/g, '/').split('/').pop()

    if (!commandPath.endsWith('.ts') && !commandPath.endsWith('.js')) {
      logger.info(`File ${commandFileName} skipped`)
      continue
    }

    const command = (await import(commandPath))?.default

    if (!command) continue

    logger.log(`File ${commandFileName} loaded`)

    commands.push(command)
  }

  store.set('localCommands', commands)

  return commands
}
