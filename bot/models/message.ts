import { IDocument } from '@bot/models/document'
import { IEmbed } from '@bot/models/embed'
import { User } from 'discord.js'
import mongoose, { Schema } from 'mongoose'

export interface IMessage extends IDocument {
  author?: User
  name?: string
  description?: string
  content?: string
  embeds?: IEmbed['_id'][]
  // components?: Component[]
}

export const MessageSchema: Schema = new Schema<IMessage>({
  author: { type: String, required: false },
  name: { type: String, required: false },
  description: { type: String, required: false },
  content: { type: String, required: false },
  embeds: { type: Schema.Types.Array, ref: 'embed', default: [] },
  // components: { type: Schema.Types.Mixed, default: [] },
})

export const Message =
  (mongoose.models.Message as mongoose.Model<IMessage>) ||
  mongoose.model<IMessage>('message', MessageSchema)
