import {
  DataBaseAction,
  DataBaseActionEvents,
} from '../modules/models/dbaction'

import logger from '../utils/helpers/logger'

export default new DataBaseAction({
  data: { name: 'database-disconnected' },

  event: DataBaseActionEvents.Disconnected,

  async execute() {
    return await logger.warn('Disconnected from database')
  },
})
