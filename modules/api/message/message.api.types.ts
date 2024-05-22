import { IMessage } from '@bot/models/message'
import { Channel, Guild } from 'discord.js'

export type GetMessagesRequest = {
  ids?: string[] | string
} | void
export type GetMessagesResponse = IMessage[]

export type GetMessageRequest = string | undefined | void
export type GetMessageResponse = IMessage

export type PostMessageRequest = Omit<IMessage, '_id'>
export type PostMessageResponse = IMessage

export type PatchMessageRequest = {
  id?: string
} & Partial<Omit<IMessage, '_id'>>
export type PatchMessageResponse = IMessage

export type SendMessageRequest = {
  message: IMessage['_id']
  guild?: Guild['id']
  channel: Channel['id']
}
export type SendMessageResponse = IMessage
