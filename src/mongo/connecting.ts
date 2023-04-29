import { DataBaseAction } from '../models/action'
import { DataBaseEvents } from '../models/event'

import logger from '../utils/helpers/logger'

export default new DataBaseAction({
  data: { name: 'database-connecting' },

  event: DataBaseEvents.Connecting,

  async execute() {
    return await logger.debug('Connecting to database')
  },
})
