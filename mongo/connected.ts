import { DataBaseAction } from '@modules/models/action'
import { DataBaseEvents } from '@modules/libs/events'

import logger from '@utils/helpers/logger'

export default new DataBaseAction({
  data: { name: 'database-connected' },

  event: DataBaseEvents.Connected,

  async execute() {
    return await logger.info('Connected to database')
  },
})
