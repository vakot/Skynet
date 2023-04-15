import throughDirectory from '../helpers/throughDirectory'
import logger from '../helpers/logger'

import { IEvent } from '../../models/event'

export default async function (eventsFolder: string): Promise<IEvent[]> {
  const events: IEvent[] = []

  for (const eventPath of throughDirectory(eventsFolder)) {
    const eventFileName = eventPath.replace(/\\/g, '/').split('/').pop()

    if (!eventPath.endsWith('.ts') && !eventPath.endsWith('.js')) {
      logger.info(`File ${eventFileName} skipped`)
      continue
    }

    const event = (await import(eventPath))?.default

    if (!event) continue

    logger.log(`File ${eventFileName} loaded`)

    events.push(event)
  }

  return events
}
