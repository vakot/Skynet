import { IDocument } from '@bot/models/document'
import { SkynetEvents } from '@bot/models/event'
import { SlashCommandBuilder, Snowflake } from 'discord.js'
import mongoose, { Schema } from 'mongoose'

export interface IGuild extends IDocument<Snowflake> {
  // event-type: Collection<action-id, options>
  [SkynetEvents.CommandInteraction]: { [key: Snowflake]: SlashCommandBuilder }
}

const GuildSchema: Schema = new Schema<IGuild>({
  _id: { type: String, required: true },
  [SkynetEvents.CommandInteraction]: { type: Schema.Types.Map, default: {}, ref: 'Action' },
})

export const Guild =
  (mongoose.models.Guild as mongoose.Model<IGuild>) || mongoose.model<IGuild>('Guild', GuildSchema)
