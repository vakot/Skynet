import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  Guild,
  Message,
  Snowflake,
  TextChannel,
  User,
} from 'discord.js'

export class Ticket {
  title: string
  reason: string

  authorId: Snowflake
  author: User

  guildId: Snowflake
  guild: Guild

  channelId?: Snowflake
  channel?: TextChannel

  messageId?: Snowflake
  message?: Message

  status: 'active' | 'closed' = 'active'

  setMessage(message: Message) {
    this.messageId = message.id
    this.message = message
  }

  getEmbed(): EmbedBuilder {
    return new EmbedBuilder()
      .setTitle(this.title)
      .setDescription(
        `<@${this.author.id}>, please wait. Support will respond as soon as possible`
      )
      .setFields(
        {
          name: 'Opened',
          value: `<t:${Math.round(this.channel!.createdTimestamp * 0.001)}:R>`,
          inline: true,
        },
        {
          name: 'Reason',
          value: '` ' + this.reason + ' `',
          inline: true,
        },
        {
          name: 'Status',
          value: '` ' + this.status.toUpperCase() + ' `',
          inline: true,
        }
      )
      .setThumbnail(this.author.displayAvatarURL())
  }
  getActionRow(): ActionRowBuilder<ButtonBuilder> {
    const closeButton = new ButtonBuilder()
      .setCustomId('close-ticket-button')
      .setLabel('Close')
      .setEmoji('🔒')
      .setStyle(ButtonStyle.Primary)
      .setDisabled(this.status === 'closed')

    return new ActionRowBuilder<ButtonBuilder>().setComponents(closeButton)
  }

  constructor(options: {
    title?: string | null
    reason?: string | null
    author: User
    guild: Guild
  }) {
    this.title = options.title ?? 'Untitled ticket'
    this.reason = options.reason ?? 'General support'

    this.authorId = options.author.id
    this.author = options.author

    this.guildId = options.guild.id
    this.guild = options.guild
  }
}

// 🔒 🔓 🗑 📩
