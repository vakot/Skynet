import mongoose, { Schema, ObjectId } from 'mongoose'

import { IDocument } from '../../../modules/models/document'

export interface ITemporaryVoice extends IDocument {
  _id: ObjectId
  guildId: string | null
  categoryId: string | null
  parentId: string | null
  childrens: Map<string, string>
  createdAt: Date
}

const TemporaryVoiceSchema = new Schema<ITemporaryVoice>({
  guildId: { type: String, default: null },
  categoryId: { type: String, default: null },
  parentId: { type: String, required: true },
  childrens: { type: Map, of: String, default: new Map() },
  createdAt: { type: Date, required: true },
})

export const TemporaryVoice =
  mongoose.models.TemporaryVoiceSchema || mongoose.model('TemporaryVoice', TemporaryVoiceSchema)
