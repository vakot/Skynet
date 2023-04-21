import { EmbedBuilder, Snowflake } from 'discord.js'

export class Ticket {
  title: string
  reason: string
  createdTimestamp: number
  authorId: Snowflake
  channelId?: Snowflake
  messageId?: Snowflake
  status: 'active' | 'closed' | 'deleted'

  setChannel = (channelId: Snowflake) => (this.channelId = channelId)
  setMessage = (messageId: Snowflake) => (this.messageId = messageId)

  open = () => this.status !== 'deleted' && (this.status = 'active')
  close = () => this.status !== 'deleted' && (this.status = 'closed')
  delete = () => (this.status = 'deleted')
  restore = () => (this.status = 'closed')

  getEmbed() {
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

  constructor(options: {
    title?: string | null
    reason?: string | null
    authorId: Snowflake
    channelId?: Snowflake
    messageId?: Snowflake
    status?: 'active' | 'closed'
  }) {
    this.title = options.title ?? 'Untitled ticket'
    this.reason = options.reason ?? 'General support'
    this.authorId = options.authorId
    this.channelId = options.channelId
    this.messageId = options.messageId
    this.status = options.status ?? 'active'
    this.createdTimestamp = Date.now()
  }
}
