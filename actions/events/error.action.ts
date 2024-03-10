import { Action } from '@modules/models/action'
import { ActionEvents } from '@modules/libs/events'

import logger from '@utils/helpers/logger'

export default new Action({
  data: { name: 'client-error-event' },

  event: ActionEvents.ClientError,

  async execute(info: string) {
    return await logger.error(info)
  },
})
