import { SkynetClient } from '@modules/SkynetClient'
import { ClientEvents } from 'discord.js'

export interface IEvent {
  type: keyof ClientEvents
  once?: boolean
  init: (client: SkynetClient, ...args: any) => any
}

export enum SkynetEvents {
  Empty = '',
  ClientReady = 'client-ready',
  ClientWarn = 'client-warn',
  ClientError = 'client-error',
  MessageCreate = 'message-create',
  MessageDelete = 'message-delete',
  MessageBulkDelete = 'message-bulk-delete',
  MessageUpdate = 'message-update',
  ReactionAdd = 'reaction-add',
  ReactionRemove = 'reaction-remove',
  ReactionRemoveAll = 'reaction-remove-all',
  ReactionRemoveEmoji = 'reaction-remove-emoji',
  MessageCommandInteraction = 'message-command-interaction',
  CommandInteraction = 'command-interaction',
  ButtonInteraction = 'button-interaction',
  SelectMenuInteraction = 'select-menu-interaction',
  VoiceJoin = 'voice-join',
  VoiceLeave = 'voice-leave',
  VoiceMove = 'voice-move',
  StreamToggle = 'stream-toggle',
  StreamStart = 'stream-start',
  StreamEnd = 'stream-end',
  ChannelCreate = 'channel-create',
  ChannelDelete = 'channel-delete',
  ChannelUpdate = 'channel-update',
  ChannelUpdatePins = 'channel-update-pins',
  ThreadCreate = 'thread-create',
  ThreadDelete = 'thread-delete',
  ThreadUpdate = 'thread-update',
  ThreadListSync = 'thread-list-sync',
  ThreadMemberUpdate = 'thread-member-update',
  ThreadMembersUpdate = 'thread-members-update',
}

export enum DataBaseEvents {
  Error = 'error',
  Connected = 'connected',
  Connecting = 'connecting',
  Disconnected = 'disconnected',
}
