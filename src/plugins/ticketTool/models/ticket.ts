import { Snowflake } from 'discord.js'

export class Ticket {
  title: string
  reason: string
  createdTimestamp: number
  authorId: Snowflake
  channelId?: Snowflake
  messageId?: Snowflake
  status: 'active' | 'closed'

  setChannel = (channelId: Snowflake) => (this.channelId = channelId)
  setMessage = (messageId: Snowflake) => (this.messageId = messageId)

  open = () => (this.status = 'active')
  close = () => (this.status = 'closed')

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
