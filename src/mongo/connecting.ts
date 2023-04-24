import { DataBaseAction, DataBaseActionEvents } from '../models/dbaction'

import logger from '../utils/helpers/logger'

export default new DataBaseAction({
  data: { name: 'database-connecting' },

  event: DataBaseActionEvents.Connecting,

  async execute() {
    return await logger.info('Connecting to database')
  },
})
