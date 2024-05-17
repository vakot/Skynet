import { IDocument } from '@bot/models/document'
import { User } from 'discord.js'
import mongoose, { Schema } from 'mongoose'

export interface IEmbed extends IDocument {
  author?: User
  name?: string
  description?: string
  // TODO: data
}

export const EmbedSchema: Schema = new Schema<IEmbed>({
  author: { type: String, required: false },
  name: { type: String, required: false },
  description: { type: String, required: false },
})

export const Embed =
  (mongoose.models.Embed as mongoose.Model<IEmbed>) || mongoose.model<IEmbed>('embed', EmbedSchema)
