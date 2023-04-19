import { ClientEvents } from 'discord.js'

export class Action {
  // data can be any, but important to set the action name
  // name used as key to store action in Collection
  data: {
    name: string // should be unique for all actions
    [key: string]: any
  }
  event: keyof ClientEvents
  // for events like ClientReady to execute only once
  once?: boolean
  // uses to determine user permission to execute this action
  // validateAction.ts will do that so you dont have to
  // P.S. (just not forget to call it)
  cooldown?: number
  deleteble?: boolean
  testOnly?: boolean
  devsOnly?: boolean
  // uses only with commands to force update it on remote
  forceUpdate?: boolean

  constructor(
    data: {
      name: string
      [key: string]: any
    },
    event: keyof ClientEvents,
    once?: boolean,
    cooldown?: number,
    deleteble?: boolean,
    testOnly?: boolean,
    devsOnly?: boolean,
    forceUpdate?: boolean
  ) {
    this.data = data
    this.event = event
    this.once = once
    this.cooldown = cooldown
    this.deleteble = deleteble
    this.testOnly = testOnly
    this.devsOnly = devsOnly
    this.forceUpdate = forceUpdate
  }

  // conditions that determines this action possibility to be executed
  async init(...args: any): Promise<any> {}
  async execute(...args: any): Promise<any> {}
}
