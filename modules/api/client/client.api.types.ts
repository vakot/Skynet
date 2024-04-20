import { Guild, User } from 'discord.js'

export interface IApiUser extends Omit<User, 'avatarURL'> {
  avatarURL: string | null
}

export interface IApiGuild extends Omit<Guild, 'iconURL'> {
  iconURL: string | null
}
