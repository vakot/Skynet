import { IPlugin } from '../../models/plugin'
import { loadPlugin } from '../loadPlugin'

const plugin: IPlugin = {
  name: 'moderation',
  commands: [],
  messageCommands: [],
  components: [],
  setup() {
    loadPlugin(plugin)
  },
}

export default plugin
