import {
  DataBaseAction,
  DataBaseActionEvents,
} from '../modules/models/dbaction'

import logger from '../utils/helpers/logger'

export default new DataBaseAction({
  data: { name: 'database-error' },

  event: DataBaseActionEvents.Error,

  async execute(error) {
    return await logger.error(error)
  },
})
