import { IAction } from './action'
import { ISleshCommand, IMessageCommand } from './command'
import { IComponent } from './component'

export interface IPlugin {
  name: string
  actions: IAction[]
  commands: ISleshCommand[]
  messageCommands: IMessageCommand[]
  components: IComponent[]
  setup(): any
}
