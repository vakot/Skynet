import {
  ClientEvents,
  // SlashCommandBuilder,
  // ButtonBuilder,
  // StringSelectMenuBuilder,
  // RoleSelectMenuBuilder,
  // UserSelectMenuBuilder,
  // ChannelSelectMenuBuilder,
  // MentionableSelectMenuBuilder,
} from 'discord.js'

export interface Action {
  // data:
  //   | SlashCommandBuilder
  //   | StringSelectMenuBuilder
  //   | RoleSelectMenuBuilder
  //   | UserSelectMenuBuilder
  //   | ChannelSelectMenuBuilder
  //   | MentionableSelectMenuBuilder
  //   | ButtonBuilder

  data?: any
  event: keyof ClientEvents
  once?: boolean
  deleteble?: boolean
  cooldown?: number
  testOnly?: boolean
  devsOnly?: boolean
  forceUpdate?: boolean
  init(...args: any): any
  execute(...args: any): any
}
