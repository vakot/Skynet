import { IDocument } from '@bot/models/document'
import { HexColorString } from 'discord.js'
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

export const Embed =
  (mongoose.models.Embed as mongoose.Model<IEmbed>) || mongoose.model<IEmbed>('embed', EmbedSchema)
