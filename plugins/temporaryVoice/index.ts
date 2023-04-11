import { IPlugin } from '../../models/plugin'
import { loadPlugin } from '../loadPlugin'

export const config = {
  parent_id: '1095278976617959444',
}

const plugin: IPlugin = {
  name: 'temporaryVoice',
  commands: {
    slesh: [],
    message: [],
  },
  components: [],
  actions: [],
  setup() {
    loadPlugin(this)
  },
}

export default plugin
