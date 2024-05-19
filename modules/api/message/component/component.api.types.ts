import { SkynetEvents } from '@bot/models/event'
import { IMessageComponent } from '@bot/models/message'

export type GetComponentsRequest = {
  ids?: string[] | string
  type?: SkynetEvents.ButtonInteraction
} | void
export type GetComponentsResponse = IMessageComponent[]

export type GetComponentRequest = string | undefined | void
export type GetComponentResponse = IMessageComponent

export type PostComponentRequest = Omit<IMessageComponent, '_id'>
export type PostComponentResponse = IMessageComponent

export type PatchComponentRequest = {
  id?: string
} & Partial<Omit<IMessageComponent, '_id'>>
export type PatchComponentResponse = IMessageComponent
