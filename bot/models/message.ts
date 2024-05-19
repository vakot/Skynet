import { IDocument } from '@bot/models/document'
import { SkynetEvents } from '@bot/models/event'
import { HexColorString, User } from 'discord.js'
import mongoose, { Schema } from 'mongoose'

export interface IEmbed extends IDocument {
  title?: string
  color?: HexColorString
  url?: string
  description?: string
  author?: {
    name: string
    url?: string
    icon_url?: string
  }
  fields?: [
    {
      name: string
      value: string
    }
  ]
  footer?: {
    text: string
    icon_url?: string
  }
  image?: {
    url: string
  }
  thumbnail?: {
    url: string
  }
}
export interface IMessageComponent extends IDocument {
  author?: User
  name?: string
  description?: string
  type: SkynetEvents
  component: any
}
export interface IMessage extends IDocument {
  author?: User
  name?: string
  description?: string
  content?: string
  embeds?: IEmbed['_id'][]
  components?: [IMessageComponent['_id'][]]
}

const EmbedSchema: Schema = new Schema({
  title: { type: String, default: null },
  color: { type: String, default: null },
  url: { type: String, default: null },
  description: { type: String, default: null },
  author: { type: Schema.Types.Mixed, default: null },
  fields: { type: Schema.Types.Array, default: [] },
  footer: { type: Schema.Types.Mixed, default: null },
  image: { type: Schema.Types.Mixed, default: null },
  thumbnail: { type: Schema.Types.Mixed, default: null },
})
const MessageComponentSchema: Schema = new Schema({
  author: { type: String, required: false },
  name: { type: String, required: false },
  description: { type: String, default: null },
  type: { type: String, required: true },
  component: { type: Schema.Types.Mixed, required: true },
})
const MessageSchema: Schema = new Schema<IMessage>({
  author: { type: String, required: false },
  name: { type: String, required: false },
  description: { type: String, required: false },
  content: { type: String, required: false },
  embeds: [{ type: Schema.Types.ObjectId, ref: 'embed' }],
  components: [[{ type: Schema.Types.ObjectId, ref: 'message-component' }]],
})

export const Embed =
  (mongoose.models.Embed as mongoose.Model<IEmbed>) || mongoose.model<IEmbed>('embed', EmbedSchema)
export const MessageComponent =
  (mongoose.models.MessageComponent as mongoose.Model<IMessageComponent>) ||
  mongoose.model<IMessageComponent>('message-component', MessageComponentSchema)
export const Message =
  (mongoose.models.Message as mongoose.Model<IMessage>) ||
  mongoose.model<IMessage>('message', MessageSchema)
