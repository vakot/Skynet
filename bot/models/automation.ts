import { Guild, User } from 'discord.js'
import mongoose, { Schema } from 'mongoose'

import { IDocument } from '@bot/models/document'
import { SkynetEvents } from '@bot/models/event'

export interface ICondition {
  event: SkynetEvents
  type: string
  property: string
  // callback: (...args: any) => boolean
  value: any
}

export interface IAction {
  event: SkynetEvents
  type: string
  property: string
  // callback: (...args: any) => void
  value: any
}

export interface IAutomation extends IDocument {
  author?: User
  name?: string
  description?: string
  guild?: Guild['id']
  event: SkynetEvents
  conditions: ICondition[]
  actions: IAction[]
}

export const AutomationSchema: Schema = new Schema<IAutomation>({
  author: { type: String, required: false },
  name: { type: String, required: false },
  description: { type: String, required: false },
  guild: { type: String, required: false },
  event: { type: String, required: true },
  conditions: [{ type: Schema.Types.Mixed, required: false }],
  actions: [{ type: Schema.Types.Mixed, required: false }],
})

export const Automation =
  (mongoose.models.Automation as mongoose.Model<IAutomation>) ||
  mongoose.model<IAutomation>('automation', AutomationSchema)
