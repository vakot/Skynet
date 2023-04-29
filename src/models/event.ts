import {
  ButtonInteraction as DiscordButtonInteraction,
  ChatInputCommandInteraction,
  ClientEvents,
  Events,
  VoiceState,
  Message,
  GuildChannel,
  TextChannel,
  NewsChannel,
  AnySelectMenuInteraction,
} from 'discord.js'

import { SkynetClient } from './client'
import { Action } from './action'
import Validator from '../utils/helpers/validator'

export interface IEvent {
  name: keyof ClientEvents
  init: (...args: any) => any
}

export const ActionEvents = {
  // #region Client
  ClientReady: {
    name: Events.ClientReady,

    async init(_, client: SkynetClient, action: Action) {
      return await action.execute(client)
    },
  } as IEvent,

  ClientWarn: {
    name: Events.Warn,

    async init(info: any, client: SkynetClient, action: Action) {
      return await action.execute(info, client)
    },
  } as IEvent,

  ClientError: {
    name: Events.Error,

    async init(info: any, client: SkynetClient, action: Action) {
      return await action.execute(info, client)
    },
  } as IEvent,
  // #endregion

  // #region Interaction
  CommandInteraction: {
    name: Events.InteractionCreate,

    async init(interaction: ChatInputCommandInteraction, client: SkynetClient, action: Action) {
      if (action.data.name !== interaction.commandName) return
      if (!interaction.isChatInputCommand()) return

      const invalidations = Validator.action(action, interaction.user, interaction.guild)
      if (invalidations.length) {
        return await interaction.reply({
          content: invalidations.join('\n'),
          ephemeral: true,
        })
      }

      return await action
        .execute(interaction, client)
        .then(() => action.saveRun(interaction.user.id))
    },
  } as IEvent,

  ButtonInteraction: {
    name: Events.InteractionCreate,

    async init(interaction: DiscordButtonInteraction, client: SkynetClient, action: Action) {
      if (action.data.name !== interaction.customId) return
      if (!interaction.isButton()) return

      const invalidations = Validator.action(action, interaction.user, interaction.guild)
      if (invalidations.length) {
        return await interaction.reply({
          content: invalidations.join('\n'),
          ephemeral: true,
        })
      }

      return await action
        .execute(interaction, client)
        .then(() => action.saveRun(interaction.user.id))
    },
  } as IEvent,

  SelectMenuInteraction: {
    name: Events.InteractionCreate,

    async init(interaction: AnySelectMenuInteraction, client: SkynetClient, action: Action) {
      if (action.data.name !== interaction.customId) return
      if (!interaction.isAnySelectMenu()) return

      const invalidations = Validator.action(action, interaction.user, interaction.guild)
      if (invalidations.length) {
        return await interaction.reply({
          content: invalidations.join('\n'),
          ephemeral: true,
        })
      }

      return await action
        .execute(interaction, client)
        .then(() => action.saveRun(interaction.user.id))
    },
  } as IEvent,
  // #endregion

  // #region Voice
  VoiceJoin: {
    name: Events.VoiceStateUpdate,

    async init(oldState: VoiceState, newState: VoiceState, client: SkynetClient, action: Action) {
      if (!newState.channelId) return
      if (oldState.channelId === newState.channelId) return
      if (!newState.member) return

      const invalidations = Validator.action(action, newState.member.user, newState.guild)
      if (invalidations.length) {
        await newState.member.voice.disconnect()
        return await newState.member.user.send(
          invalidations.join('\n') + '\n⤷ You can delete this message with `/clear-dms`'
        )
      }

      return await action.execute(oldState, newState, client)
    },
  } as IEvent,

  VoiceLeave: {
    name: Events.VoiceStateUpdate,

    async init(oldState: VoiceState, newState: VoiceState, client: SkynetClient, action: Action) {
      if (!oldState.channelId) return
      if (oldState.channelId === newState.channelId) return
      if (!oldState.member) return

      const invalidations = Validator.action(action, oldState.member.user, oldState.guild)
      if (invalidations.length) {
        await oldState.member.voice.disconnect()
        return await oldState.member.user.send(
          invalidations.join('\n') + '\n⤷ You can delete this message with `/clear-dms`'
        )
      }

      return await action.execute(oldState, newState, client)
    },
  } as IEvent,

  VoiceMove: {
    name: Events.VoiceStateUpdate,

    async init(oldState: VoiceState, newState: VoiceState, client: SkynetClient, action: Action) {
      if (!oldState.channelId || !newState.channelId) return
      if (oldState.channelId === newState.channelId) return

      if (!oldState.member) return

      const invalidations = Validator.action(action, oldState.member.user, oldState.guild)
      if (invalidations.length) {
        await oldState.member.voice.disconnect()
        return await oldState.member.user.send(
          invalidations.join('\n') + '\n⤷ You can delete this message with `/clear-dms`'
        )
      }

      return await action.execute(oldState, newState, client)
    },
  } as IEvent,

  VoiceStream: {
    name: Events.VoiceStateUpdate,

    async init(oldState: VoiceState, newState: VoiceState, client: SkynetClient, action: Action) {
      if (oldState.channelId !== newState.channelId) return
      if (oldState.streaming === newState.streaming) return

      return await action.execute(oldState, newState, client)
    },
  } as IEvent,

  VoiceStreamStart: {
    name: Events.VoiceStateUpdate,

    async init(oldState: VoiceState, newState: VoiceState, client: SkynetClient, action: Action) {
      if (oldState.channelId !== newState.channelId) return
      if (oldState.streaming === newState.streaming) return
      if (oldState.streaming || !newState.streaming) return

      return await action.execute(oldState, newState, client)
    },
  } as IEvent,

  VoiceStreamEnd: {
    name: Events.VoiceStateUpdate,

    async init(oldState: VoiceState, newState: VoiceState, client: SkynetClient, action: Action) {
      if (oldState.channelId !== newState.channelId) return
      if (oldState.streaming === newState.streaming) return
      if (!oldState.streaming || newState.streaming) return

      return await action.execute(oldState, newState, client)
    },
  } as IEvent,
  // #endregion

  // #region Message
  MessageCommandInteraction: {
    name: Events.MessageCreate,

    async init(message: Message, client: SkynetClient, action: Action) {
      // TODO: split message to command

      const command: string[] = []

      if (!command.length) return
      if (action.data.name !== command[0]) return

      return await action.execute(command, client)
    },
  } as IEvent,

  MessageCreate: {
    name: Events.MessageCreate,

    async init(message: Message, client: SkynetClient, action: Action) {
      return await action.execute(message, client)
    },
  } as IEvent,

  MessageDelete: {
    name: Events.MessageDelete,

    async init(message: Message, client: SkynetClient, action: Action) {
      return await action.execute(message, client)
    },
  } as IEvent,

  MessageBulkDelete: {
    name: Events.MessageBulkDelete,

    async init(message: Message, client: SkynetClient, action: Action) {
      return await action.execute(message, client)
    },
  } as IEvent,

  MessageUpdate: {
    name: Events.MessageUpdate,

    async init(oldMessage: Message, newMessage: Message, client: SkynetClient, action: Action) {
      if (oldMessage.content === newMessage.content) return

      return await action.execute(oldMessage, newMessage, client)
    },
  } as IEvent,

  MessageReactionAdd: {
    name: Events.MessageReactionAdd,

    async init(message: Message, client: SkynetClient, action: Action) {
      return await action.execute(message, client)
    },
  } as IEvent,

  MessageReactionRemove: {
    name: Events.MessageReactionRemove,

    async init(message: Message, client: SkynetClient, action: Action) {
      return await action.execute(message, client)
    },
  } as IEvent,

  MessageReactionRemoveAll: {
    name: Events.MessageReactionRemoveAll,

    async init(message: Message, client: SkynetClient, action: Action) {
      return await action.execute(message, client)
    },
  } as IEvent,

  MessageReactionRemoveEmoji: {
    name: Events.MessageReactionRemoveEmoji,

    async init(message: Message, client: SkynetClient, action: Action) {
      return await action.execute(message, client)
    },
  } as IEvent,
  // #endregion

  // #region Channel
  ChannelCreate: {
    name: Events.ChannelCreate,

    async init(channel: GuildChannel, client: SkynetClient, action: Action) {
      return await action.execute(channel, client)
    },
  } as IEvent,

  ChannelDelete: {
    name: Events.ChannelDelete,

    async init(channel: GuildChannel, client: SkynetClient, action: Action) {
      return await action.execute(channel, client)
    },
  } as IEvent,

  ChannelUpdate: {
    name: Events.ChannelUpdate,

    async init(
      oldState: GuildChannel,
      newState: GuildChannel,
      client: SkynetClient,
      action: Action
    ) {
      return await action.execute(oldState, newState, client)
    },
  } as IEvent,

  ChannelPinsUpdate: {
    name: Events.ChannelPinsUpdate,

    async init(
      channel: TextChannel | NewsChannel,
      time: Date,
      client: SkynetClient,
      action: Action
    ) {
      return await action.execute(channel, time, client)
    },
  } as IEvent,
  // #endregion

  // #region Guild
  //
  // #endregion

  // #region Roles
  //
  // #endregion

  // #region Members
  //
  // #endregion
}

export enum DataBaseEvents {
  Error = 'error',
  Connected = 'connected',
  Connecting = 'connecting',
  Disconnected = 'disconnected',
}
