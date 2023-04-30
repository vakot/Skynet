import mongoose, { Schema, ObjectId } from 'mongoose'

import { IDocument } from '../../../modules/models/document'

export interface ITicket extends IDocument {
  _id: ObjectId
  title: string
  reason: string
  closed: boolean
  guildId: string
  authorId: string
  authorAvatar: string | null
  parentId: string
  threadId: string
  messageId: string
  supportTeam: [string]
  createdAt: Date
}

const TicketToolSchema = new Schema<ITicket>({
  title: { type: String, required: true },
  reason: { type: String, required: true },
  closed: { type: Boolean, default: false },
  guildId: { type: String, required: true },
  authorId: { type: String, required: true },
  authorAvatar: { type: String, default: null },
  parentId: { type: String, required: true },
  threadId: { type: String, required: true },
  messageId: { type: String, required: false },
  supportTeam: { type: [String], default: [] },
  createdAt: { type: Date, required: true },
})

export const TicketTool =
  mongoose.models.TicketToolSchema || mongoose.model('TicketTool', TicketToolSchema)
