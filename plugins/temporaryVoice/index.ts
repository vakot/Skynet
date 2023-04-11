import { IPlugin } from '../../models/plugin'
import { loadPlugin } from '../loadPlugin'

const plugin: IPlugin = {
  name: 'temporaryVoice',
  commands: [],
  messageCommands: [],
  components: [],
  actions: [],
  setup() {
    loadPlugin(plugin)
  },
}

export default plugin
