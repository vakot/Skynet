import { IAction } from '@bot/models/action'
import { SkynetEvents } from '@bot/models/event'

export function isAction(object: any): object is IAction {
  const action = object as IAction

  return (
    'event' in action &&
    typeof action.event === 'string' &&
    Object.values(SkynetEvents).includes(action.event) &&
    (!('cooldown' in action) || typeof action.cooldown === 'number') &&
    (!('testOnly' in action) || typeof action.testOnly === 'boolean') &&
    (!('devsOnly' in action) || typeof action.devsOnly === 'boolean') &&
    // && (!('permissions' in action) || typeof action.permissions === '')
    // && (!('roles' in action) || typeof action.roles === '')
    // && (!('category' in action) || typeof action.category === '')
    // && (!('history' in action) || typeof action.history === '')
    'execute' in action &&
    typeof action.execute === 'function'
  )
}

// export class BaseActionBuilder implements IAction {
//   name?: string
//   description?: string
//   data?: { name: string; [key: string]: any }
//   event: SkynetEvents
//   cooldown?: number
//   deletable?: boolean
//   testOnly?: boolean
//   devsOnly?: boolean
//   forceUpdate?: boolean
//   permissions?: Array<Permissions>
//   roles?: Array<Snowflake>
//   category?: ICategory
//   history?: { userId: Snowflake; timestamp: Date }[]
//   precondition?: (client: SkynetClient, ...args: any) => Promise<boolean>
//   execute: (client: SkynetClient, ...args: any) => Promise<any>

//   constructor() {
//     this.event = SkynetEvents.Empty
//     this.execute = async () => {}
//   }

//   setName(name: string): this {
//     this.name = name
//     return this
//   }

//   setDescription(description: string): this {
//     this.description = description
//     return this
//   }

//   setData(data: { name: string; [key: string]: any }): this {
//     this.data = data
//     return this
//   }

//   setEvent(event: SkynetEvents): this {
//     this.event = event
//     return this
//   }

//   setCooldown(cooldown: number): this {
//     this.cooldown = cooldown
//     return this
//   }

//   setOptions(options: {
//     deletable?: boolean
//     testOnly?: boolean
//     devsOnly?: boolean
//     forceUpdate?: boolean
//   }): this {
//     this.deletable = options.deletable
//     this.testOnly = options.testOnly
//     this.devsOnly = options.devsOnly
//     this.forceUpdate = options.forceUpdate
//     return this
//   }

//   setDeletable(deletable: boolean): this {
//     this.deletable = deletable
//     return this
//   }

//   setTestOnly(testOnly: boolean): this {
//     this.testOnly = testOnly
//     return this
//   }

//   setDevsOnly(devsOnly: boolean): this {
//     this.devsOnly = devsOnly
//     return this
//   }

//   setForceUpdate(forceUpdate: boolean): this {
//     this.forceUpdate = forceUpdate
//     return this
//   }

//   setPermissions(permissions: Array<Permissions>): this {
//     this.permissions = permissions
//     return this
//   }

//   setRoles(roles: Array<Snowflake>): this {
//     this.roles = roles
//     return this
//   }

//   setCategory(category: ICategory): this {
//     this.category = category
//     return this
//   }

//   setPrecondition(precondition: (client: SkynetClient, ...args: any) => Promise<boolean>): this {
//     this.precondition = precondition
//     return this
//   }

//   setAction(execute: (client: SkynetClient, ...args: any) => Promise<any>): this {
//     this.execute = execute
//     return this
//   }
// }

// export class CommandActionBuilder extends BaseActionBuilder {
//   precondition?: (
//     client: SkynetClient,
//     interaction: ChatInputCommandInteraction
//   ) => Promise<boolean>
//   execute: (client: SkynetClient, interaction: ChatInputCommandInteraction) => Promise<any>

//   event:
//     | SkynetEvents.Empty
//     | SkynetEvents.MessageCommandInteraction
//     | SkynetEvents.CommandInteraction

//   constructor() {
//     super()
//     this.event = SkynetEvents.Empty
//     this.execute = async (client: SkynetClient, interaction: ChatInputCommandInteraction) => {
//       if (interaction.isRepliable()) {
//         return interaction.reply({
//           content: 'Command action is not provided',
//           ephemeral: true,
//         })
//       }
//     }
//   }

//   setEvent(
//     event:
//       | SkynetEvents.Empty
//       | SkynetEvents.MessageCommandInteraction
//       | SkynetEvents.CommandInteraction
//   ): this {
//     this.event = event
//     return this
//   }
//   setPrecondition(
//     precondition: (
//       client: SkynetClient,
//       interaction: ChatInputCommandInteraction
//     ) => Promise<boolean>
//   ): this {
//     this.precondition = precondition
//     return this
//   }
//   setAction(
//     execute: (client: SkynetClient, interaction: ChatInputCommandInteraction) => Promise<any>
//   ): this {
//     this.execute = execute
//     return this
//   }
// }
