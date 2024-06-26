import { IAction } from '@bot/models/action'
import { IDocument } from '@bot/models/document'
import { SkynetEvents } from '@bot/models/event'
import { BaseGuild, Snowflake, User } from 'discord.js'
import mongoose, { Schema } from 'mongoose'

export interface IListener extends IDocument<Snowflake> {
  _id: Snowflake
  author?: User
  name?: string
  description?: string
  guild?: BaseGuild['id']
  action?: IAction
  event: SkynetEvents
}

export const ListenerSchema: Schema = new Schema<IListener>({
  _id: { type: String, required: true, default: () => new mongoose.Types.ObjectId().toString() },
  author: { type: String, required: false },
  name: { type: String, required: false },
  description: { type: String, required: false },
  guild: { type: String, required: false },
  action: { type: Schema.Types.ObjectId, ref: 'action', required: true },
  event: { type: String, required: true },
})

export const Listener =
  (mongoose.models.Listener as mongoose.Model<IListener>) ||
  mongoose.model<IListener>('listener', ListenerSchema)
