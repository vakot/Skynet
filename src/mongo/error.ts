import { DataBaseAction } from '../modules/models/action'
import { DataBaseEvents } from '../modules/libs/events'

import logger from '../utils/helpers/logger'

export default new DataBaseAction({
  data: { name: 'database-error' },

  event: DataBaseEvents.Error,

  async execute(error) {
    return await logger.error(error)
  },
})
