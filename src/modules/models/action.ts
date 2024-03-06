import { Permissions, Snowflake } from 'discord.js'

import { SkynetEvents } from '@modules/libs/events'
import { ICategory } from '@modules/models/category'

import { SkynetClient } from '@modules/models/client'
import mongoose, { Schema } from 'mongoose'

export interface IAction {
  /**
   * Title to be shown in constructor
   */
  name?: string
  /**
   * Description to be shown in constructor
   */
  description?: string

  /**
   * Name of defined SkynetEvents
   */
  event: SkynetEvents

  /**
   * Action `cooldown` determite how often user can execute this action
   * @example ```cooldown: 10_000``` - action can be used once in 10s period
   */
  cooldown?: number

  /**
   * Actions with mark `testOnly` can be used only on bot test server
   */
  testOnly?: boolean
  /**
   * Actions with mark `devsOnly` can be used only by bot developers
   */
  devsOnly?: boolean

  /**
   * Permissions the user must have to perform action. Can be ovewrited in
   * `SlashCommands` but for components such as `Button` or `Select` this field will be used
   * @example
   * async precondition(interaction: Interaction) {
   *   const { user, channel } = interaction
   *
   *   const allowed = validator.hasAllChannelPermissions(user, channel, this.permissions)
   *
   *   if (!allowed) {
   *     await interaction.reply({
   *       content: "Don't have enough permissions",
   *       ephemeral: true,
   *     })
   *   }
   *
   *   return allowed
   * },
   */
  permissions?: Array<Permissions>
  /**
   * Roles the user must have to perform action. Can be ovewrited in
   * @example
   * async precondition(interaction: Interaction) {
   *   const { member, channel } = interaction
   *
   *   const allowed = validator.hasAnyRoles(member, this.roles)
   *
   *   if (!allowed) {
   *     await interaction.reply({
   *       content: "Don't have enough roles permissions",
   *       ephemeral: true,
   *     })
   *   }
   *
   *   return allowed
   * },
   */
  roles?: Array<Snowflake>

  /**
   * Used to sort actions by categories. Categories only used in `/help` command
   */
  category?: ICategory

  /**
   * Used to store action runs history
   */
  history?: { userId: Snowflake; timestamp: Date }[]

  /**
   * Set of preconditional rules
   */
  preconditions?: string[]

  /**
   * Main action body function that should do all the work
   * @param args any set of parameters that will be determined in created action
   */
  execute: (client: SkynetClient, ...args: any) => Promise<any>
}

export const ActionSchema: Schema = new Schema<IAction>(
  {
    name: { type: String, required: false },
    description: { type: String, required: false },
    event: { type: String, required: true },
    cooldown: { type: Number, required: false },
    testOnly: { type: Boolean, required: false },
    devsOnly: { type: Boolean, required: false },
    permissions: { type: [String], required: false },
    roles: { type: [String], required: false },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: false },
    history: { type: [{ userId: String, timestamp: Date }], required: false },
    preconditions: { type: [String], default: [] },
    execute: { type: String, required: true },
  },
  {
    toObject: {
      transform: (_, action) => {
        try {
          action.execute = new Function(`return ${action.execute}`)()
        } catch {
          action.execute = () => {}
        }
      },
    },
  }
)

export const Action = mongoose.models.Action || mongoose.model<IAction>('Action', ActionSchema)
