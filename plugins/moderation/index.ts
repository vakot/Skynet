import { IPlugin } from '../../models/plugin'
import { loadPlugin } from '../loadPlugin'

const plugin: IPlugin = {
  name: 'moderation',
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
