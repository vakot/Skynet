import { IEmbed } from '@bot/models/embed'

export type GetEmbedsRequest = {
  ids?: string[] | string
} | void
export type GetEmbedsResponse = IEmbed[]

export type GetEmbedRequest = string | undefined | void
export type GetEmbedResponse = IEmbed

export type PostEmbedRequest = Omit<IEmbed, '_id'>
export type PostEmbedResponse = IEmbed

export type PatchEmbedRequest = {
  id?: string
} & Partial<Omit<IEmbed, '_id'>>
export type PatchEmbedResponse = IEmbed
