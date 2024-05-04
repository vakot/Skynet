import { IDocument } from '@bot/models/document'
import { Snowflake } from 'discord.js'
import mongoose, { Schema } from 'mongoose'

export interface IGuild extends IDocument<Snowflake> {
  [key: string]: any
}

const GuildSchema: Schema = new Schema<IGuild>()

export const Guild = mongoose.models.Guild || mongoose.model<IGuild>('Guild', GuildSchema)
