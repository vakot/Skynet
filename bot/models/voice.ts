import { IAction } from '@bot/models/action'
import { IDocument } from '@bot/models/document'
import { Guild, User, VoiceBasedChannel } from 'discord.js'
import mongoose, { Schema } from 'mongoose'

export interface IVoice extends IDocument {
  author?: User
  name: string
  description: string
  guild?: Guild['id']
  channel?: VoiceBasedChannel['id']
  onJoin?: IAction['_id']
  onLeave?: IAction['_id']
  onMove?: IAction['_id']
  onStreamStart?: IAction['_id']
  onStreamEnd?: IAction['_id']
  onStreamToggle?: IAction['_id']
}

export const VoiceSchema: Schema = new Schema<IVoice>({
  author: { type: String, required: false },
  name: { type: String, required: true },
  description: { type: String, required: true },
  guild: { type: String, required: false },
  channel: { type: String, required: true },
  onJoin: { type: Schema.Types.ObjectId, ref: 'action', required: false },
  onLeave: { type: Schema.Types.ObjectId, ref: 'action', required: false },
  onMove: { type: Schema.Types.ObjectId, ref: 'action', required: false },
  onStreamStart: { type: Schema.Types.ObjectId, ref: 'action', required: false },
  onStreamEnd: { type: Schema.Types.ObjectId, ref: 'action', required: false },
  onStreamToggle: { type: Schema.Types.ObjectId, ref: 'action', required: false },
})

export const Voice =
  (mongoose.models.Voice as mongoose.Model<IVoice>) || mongoose.model<IVoice>('voice', VoiceSchema)
