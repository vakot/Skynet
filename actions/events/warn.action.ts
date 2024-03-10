import { Action } from '@modules/models/action'
import { ActionEvents } from '@modules/libs/events'

import logger from '@utils/helpers/logger'

export default new Action({
  data: { name: 'client-warn-event' },

  event: ActionEvents.ClientWarn,

  async execute(info: string) {
    return await logger.warn(info)
  },
})
