import { User } from 'discord.js'
import mongoose, { Schema } from 'mongoose'

import { SkynetClient } from '@bot/client'
import { ICategory } from '@bot/models/category'
import { IDocument } from '@bot/models/document'
import { SkynetEvents } from '@bot/models/event'

export interface IAction extends IDocument {
  author?: User
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
   * Permission bitfield (32-bit number)
   *
   * Permissions the user must have to perform action. Can be ovewrited in
   * `SlashCommands` but for components such as `Button` or `Select` this field will be used
   */
  permissions?: number

  /**
   * Used to sort actions by categories. Categories only used in `/help` command
   */
  category?: ICategory

  /**
   * Availible only for this.author user
   */
  private?: boolean

  /**
   * Main action body function that should do all the work
   * @param client bot client instanse
   * @param args any set of parameters that will be determined in created action
   */
  execute: (client: SkynetClient, ...args: any) => Promise<any>
}

export const ActionSchema: Schema = new Schema<IAction>(
  {
    author: { type: String, required: false },
    name: { type: String, required: false },
    description: { type: String, required: false },
    event: { type: String, required: true },
    cooldown: { type: Number, required: false },
    testOnly: { type: Boolean, required: false },
    devsOnly: { type: Boolean, required: false },
    permissions: { type: Number, required: false },
    private: { type: Boolean, default: false },
    category: { type: String, ref: 'category', required: false },
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

export const Action =
  (mongoose.models.Action as mongoose.Model<IAction>) ||
  mongoose.model<IAction>('action', ActionSchema)
