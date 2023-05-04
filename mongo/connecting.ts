import { DataBaseAction } from '@modules/models/action'
import { DataBaseEvents } from '@modules/libs/events'

import logger from '@utils/helpers/logger'

export default new DataBaseAction({
  data: { name: 'database-connecting' },

  event: DataBaseEvents.Connecting,

  async execute() {
    return await logger.debug('Connecting to database')
  },
})
