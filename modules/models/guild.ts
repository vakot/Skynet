import { Collection, Snowflake } from 'discord.js'
import mongoose, { Schema } from 'mongoose'

export interface IGuild {
  _id: Snowflake
  // plugins: // TODO:
  /**
   * Collection<name, actionId>
   */
  commands: Collection<string, string>
  /**
   * Array<actionId>
   */
  messages: string[]
}

const GuildSchema: Schema = new Schema<IGuild>({
  _id: { type: String, require: true },
  commands: { type: Schema.Types.Map, default: {} },
  messages: { type: [String], default: [] },
})

export const Guild = mongoose.models.Guild || mongoose.model<IGuild>('Guild', GuildSchema)
