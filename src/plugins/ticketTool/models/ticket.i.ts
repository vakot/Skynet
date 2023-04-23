import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  Snowflake,
} from 'discord.js'

export class Ticket {
  title: string
  reason: string
  createdTimestamp: number
  authorId: Snowflake
  guildId: Snowflake
  channelId?: Snowflake
  messageId?: Snowflake
  status: 'active' | 'closed' | 'deleted'

  getChannel(): Snowflake {
    return this.channelId || ''
  }
  getMessage(): Snowflake {
    return this.messageId || ''
  }

  setChannel(channelId: Snowflake): void {
    this.channelId = channelId
  }
  setMessage(messageId: Snowflake): void {
    this.messageId = messageId
  }

  open(): void {
    if (this.status !== 'deleted') this.status = 'active'
  }
  close(): void {
    if (this.status !== 'deleted') this.status = 'closed'
  }
  delete(): void {
    if (this.status === 'closed') this.status = 'deleted'
  }
  restore(): void {
    if (this.status === 'deleted') this.status = 'closed'
  }

  getEmbed(): EmbedBuilder {
    return new EmbedBuilder()
      .setTitle(this.title)
      .setDescription(
        `<@${this.authorId}>, please wait. Support will respond as soon as possible`
      )
      .setFields(
        {
          name: 'Opened',
          value: `<t:${Math.round(this.createdTimestamp * 0.001)}:R>`,
          inline: true,
        },
        {
          name: 'Reason',
          value: this.reason,
          inline: true,
        },
        {
          name: 'Status',
          value: this.status.toUpperCase(),
          inline: true,
        }
      )
  }

  getActionRow(): ActionRowBuilder<ButtonBuilder> {
    const openButton = new ButtonBuilder()
      .setCustomId('open-ticket-button')
      .setLabel('Open')
      .setStyle(ButtonStyle.Primary)
      .setDisabled(this.status === 'active' || this.status === 'deleted')

    const closeButton = new ButtonBuilder()
      .setCustomId('close-ticket-button')
      .setLabel('Close')
      .setStyle(ButtonStyle.Primary)
      .setDisabled(this.status === 'closed' || this.status === 'deleted')

    const deleteButton = new ButtonBuilder()
      .setCustomId('delete-ticket-button')
      .setLabel('Delete')
      .setStyle(ButtonStyle.Danger)
      .setDisabled(this.status === 'active' || this.status === 'deleted')

    return new ActionRowBuilder<ButtonBuilder>().setComponents(
      openButton,
      closeButton,
      deleteButton
    )
  }

  constructor(options: {
    title?: string | null
    reason?: string | null
    authorId: Snowflake
    guildId: Snowflake
    channelId?: Snowflake
    messageId?: Snowflake
    status?: 'active' | 'closed'
  }) {
    this.title = options.title ?? 'Untitled ticket'
    this.reason = options.reason ?? 'General support'
    this.authorId = options.authorId
    this.guildId = options.guildId
    this.channelId = options.channelId
    this.messageId = options.messageId
    this.status = options.status ?? 'active'
    this.createdTimestamp = Date.now()
  }
}
