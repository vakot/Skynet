import logger from './logger'
import { throughDirectory } from './throughDirectory'

export default async function (eventsFolder: string) {
  const events: { name: string; callback: Function }[] = []

  for (const eventPath of throughDirectory(eventsFolder)) {
    const eventFileName = eventPath.replace(/\\/g, '/').split('/').pop()

    if (!eventPath.endsWith('.ts') && !eventPath.endsWith('.js')) {
      logger.info(`File ${eventFileName} skipped`)
      continue
    }

    const event = (await import(eventPath))?.default

    if (!event) continue

    logger.log(`File ${eventFileName} loaded`)

    const name = eventFileName.split('.').shift()

    events.push({ name, callback: event })
  }

  return events
}
