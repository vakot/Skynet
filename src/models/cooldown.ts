import { Collection, Snowflake } from 'discord.js'

export interface ICooldown {
  interaction: string
  timestamps: Collection<Snowflake, number>
}
