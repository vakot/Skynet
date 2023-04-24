import {
  DataBaseAction,
  DataBaseActionEvents,
} from '../modules/models/dbaction'

import logger from '../utils/helpers/logger'

export default new DataBaseAction({
  data: { name: 'database-connected' },

  event: DataBaseActionEvents.Connected,

  async execute() {
    return await logger.debug('Connected to database')
  },
})
