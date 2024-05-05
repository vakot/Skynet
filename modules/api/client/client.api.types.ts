import { Guild, User } from 'discord.js'

export interface IClientUser extends Omit<User, 'avatarURL'> {
  avatarURL: string | null
}

export interface IClientGuild extends Omit<Guild, 'iconURL'> {
  iconURL: string | null
}
