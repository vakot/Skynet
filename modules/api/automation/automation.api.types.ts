import { IAutomation } from '@bot/models/automation'
import { SkynetEvents } from '@bot/models/event'

export type GetAutomationsRequest = {
  ids?: string[] | string
  guild?: string
  event?: SkynetEvents
} | void
export type GetAutomationsResponse = IAutomation[]

export type GetAutomationRequest = string | undefined | void
export type GetAutomationResponse = IAutomation

export type PostAutomationRequest = Omit<IAutomation, '_id'>
export type PostAutomationResponse = IAutomation

export type PatchAutomationRequest = {
  id?: string
} & Partial<Omit<IAutomation, '_id'>>
export type PatchAutomationResponse = IAutomation
