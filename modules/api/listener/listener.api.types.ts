import { SkynetEvents } from '@bot/models/event'
import { IListener } from '@bot/models/listener'

export type GetListenersRequest = {
  ids?: string[] | string
  guild?: string
  event?: SkynetEvents
} | void
export type GetListenersResponse = IListener[]

export type GetListenerRequest = string | undefined | void
export type GetListenerResponse = IListener

export type PostListenerRequest = Omit<IListener, '_id'>
export type PostListenerResponse = IListener

export type PatchListenerRequest = {
  id?: string
} & Partial<Omit<IListener, '_id'>>
export type PatchListenerResponse = IListener
