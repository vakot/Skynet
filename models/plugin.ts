import { IAction } from './action'
import { ISleshCommand, IMessageCommand } from './command'
import { IComponent } from './component'

export interface IPlugin {
  name: string
  actions: IAction[]
  commands: {
    slesh: ISleshCommand[]
    message: IMessageCommand[]
  }
  components: IComponent[]
  setup(): any
}
