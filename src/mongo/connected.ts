import { DataBaseAction } from '../models/action'
import { DataBaseEvents } from '../models/event'

import logger from '../utils/helpers/logger'

export default new DataBaseAction({
  data: { name: 'database-connected' },

  event: DataBaseEvents.Connected,

  async execute() {
    return await logger.info('Connected to database')
  },
})
