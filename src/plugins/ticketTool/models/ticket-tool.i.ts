import mongoose, { Schema, ObjectId } from 'mongoose'

import { IDocument } from '../../../models/document'

export interface ITicket extends IDocument {
  _id: ObjectId
  guildId: string
  title: string
  reason: string
  closed: boolean
  authorId: string
  channelId: string
  messageId: string
  categoryId: string | null
  createdAt: Date
}

const TicketToolSchema = new Schema<ITicket>({
  guildId: { type: String, required: true },
  title: { type: String, required: true },
  reason: { type: String, required: true },
  closed: { type: Boolean, default: false },
  authorId: { type: String, required: true },
  channelId: { type: String, required: true },
  messageId: { type: String, required: false },
  categoryId: { type: String, default: null },
  createdAt: { type: Date, required: true },
})

export const TicketTool =
  mongoose.models.TicketToolSchema ||
  mongoose.model('TicketTool', TicketToolSchema)
