import { Collection, Snowflake } from 'discord.js'
import mongoose, { Schema } from 'mongoose'

export interface IGuild {
  _id: Snowflake
  /**
   * Collection<name, actionId>
   */
  command: Collection<string, string>
}

const GuildSchema: Schema = new Schema<IGuild>({
  _id: { type: String, require: true },
  command: { type: Schema.Types.Map, default: {} },
})

export const Guild = mongoose.models.Guild || mongoose.model<IGuild>('Guild', GuildSchema)
