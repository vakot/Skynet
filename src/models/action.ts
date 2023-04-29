import { PermissionResolvable, Snowflake } from 'discord.js'

import { DataBaseEvents, IEvent } from './event'

// TODO: test out interface IAction instead of class (main problem is dynamic file loading)
// export interface IAction {
//   data: {
//     // should be unique for all actions
//     name: string
//     [key: string]: any
//   }
//   event: IEvent

//   deleteble?: boolean
//   cooldown?: number
//   category?: string
// }

export class Action {
  // data can be any, but important to set the action name
  // name used as key to store action in Collection
  readonly data: {
    name: string // should be unique for all actions
    [key: string]: any
  }

  readonly event: IEvent
  readonly once?: boolean

  // uses to determine user permission to execute this action
  // validateAction.ts will do that so you dont have to
  // P.S. (just not forget to call it)
  readonly cooldown?: number
  readonly deleteble?: boolean
  readonly testOnly?: boolean
  readonly devsOnly?: boolean

  // permissions can be ovewrited in SlashCommandBuilder for command
  // but for components use this field
  readonly permissions?: PermissionResolvable[]
  // roles that have access to the action
  readonly roles?: Snowflake[]

  // uses only with commands to force update it on remote
  readonly forceUpdate?: boolean
  // used only for /help command to sort all commands by categories
  readonly category?: string

  readonly runs: { userId: Snowflake; timestamp: Date }[] = []

  saveRun(userId: Snowflake): void {
    const timestamp = new Date()
    this.runs.push({ userId, timestamp })
  }

  async execute(...args: any): Promise<any> {}

  constructor(options: {
    data: {
      name: string
      [key: string]: any
    }
    event: IEvent
    once?: boolean
    cooldown?: number
    deleteble?: boolean
    testOnly?: boolean
    devsOnly?: boolean
    forceUpdate?: boolean
    category?: string
    permissions?: PermissionResolvable[]
    roles?: Snowflake[]
    execute(...args: any): Promise<any>
  }) {
    const {
      data,
      event,
      once = false,
      cooldown = 0,
      deleteble = false,
      testOnly = false,
      devsOnly = false,
      forceUpdate = false,
      category = 'General',
      permissions = [],
      roles = [],
      execute,
    } = options

    this.data = data
    this.event = event
    this.once = once
    this.cooldown = cooldown
    this.deleteble = deleteble
    this.testOnly = testOnly
    this.devsOnly = devsOnly
    this.forceUpdate = forceUpdate
    this.category = category
    this.permissions = permissions
    this.roles = roles
    this.execute = execute
  }
}

export class DataBaseAction {
  data: { name: string }

  event: DataBaseEvents

  once: boolean

  async execute(...args: any): Promise<any> {}

  constructor(options: {
    data: { name: string }
    event: DataBaseEvents
    once?: boolean
    execute(...args: any): Promise<any>
  }) {
    this.data = options.data
    this.event = options.event
    this.once = options.once ?? false
    this.execute = options.execute
  }
}
