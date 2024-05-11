import { IAction } from '@bot/models/action'
import { SkynetEvents } from '@bot/models/event'

export type GetActionsRequest = {
  ids?: string[] | string
  event?: SkynetEvents
} | void
export type GetActionsResponse = IAction[]

export type GetActionRequest = string | undefined | void
export type GetActionResponse = IAction

export type PostActionRequest = Omit<IAction, '_id'>
export type PostActionResponse = IAction

export type PatchActionRequest = {
  id?: string
} & Partial<Omit<IAction, '_id'>>
export type PatchActionResponse = IAction
