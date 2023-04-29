import { DataBaseAction } from '../models/action'
import { DataBaseEvents } from '../models/event'

import logger from '../utils/helpers/logger'

export default new DataBaseAction({
  data: { name: 'database-disconnected' },

  event: DataBaseEvents.Disconnected,

  async execute() {
    return await logger.warn('Disconnected from database')
  },
})
