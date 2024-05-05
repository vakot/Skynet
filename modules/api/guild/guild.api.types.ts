import { IGuild } from '@bot/models/guild'

export interface PostGuildResponse extends IGuild {}
export interface PostGuildRequest extends Partial<IGuild> {}
