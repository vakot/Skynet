import { IDocument } from '@bot/models/document'
import mongoose, { Schema } from 'mongoose'

export interface IEmbed extends IDocument {
  title?: string
  color?: string
  url?: string
  description?: string
  author?: {
    name?: string
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
    text?: string
    icon_url?: string
  }
  image?: {
    url?: string
  }
  thumbnail?: {
    url?: string
  }
}

const EmbedSchema: Schema = new Schema({
  title: { type: String, required: false },
  color: { type: String, required: false },
  url: { type: String, required: false },
  description: { type: String, required: false },
  author: { type: Schema.Types.Mixed, required: false },
  fields: { type: Schema.Types.Array, default: [] },
  footer: { type: Schema.Types.Mixed, required: false },
  image: { type: Schema.Types.Mixed, required: false },
  thumbnail: { type: Schema.Types.Mixed, required: false },
})

export const Embed =
  (mongoose.models.Embed as mongoose.Model<IEmbed>) || mongoose.model<IEmbed>('embed', EmbedSchema)
