import { IDocument } from '@bot/models/document'
import { User } from 'discord.js'
import mongoose, { Schema } from 'mongoose'

export interface ICategory extends IDocument {
  author?: User
  name: string
  description?: string
  emoji?: string
  /**
   * Visible only for this.author user
   */
  private?: boolean
}

export const CategorySchema: Schema = new Schema<ICategory>({
  author: { type: String, required: false },
  name: { type: String, required: true },
  description: { type: String, required: false },
  emoji: { type: String, required: false },
  private: { type: Boolean, default: false },
})

export const Category =
  (mongoose.models.Category as mongoose.Model<ICategory>) ||
  mongoose.model<ICategory>('category', CategorySchema)
